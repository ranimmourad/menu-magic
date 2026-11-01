import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { Trash2, Plus, LogOut, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { menuQuery, imageMap, type MenuCategory } from '@/lib/menu';
import logo from '@/assets/mabillon-logo.png';

export const Route = createFileRoute('/admin26102026')({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Espace gérant — Le Mabillon' },
    { name: 'description', content: 'Gestion de la carte du Mabillon.' },
    { name: 'robots', content: 'noindex' },
  ] }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/"><img src={logo} alt="Le Mabillon" className="header-logo" /></Link>
        {session && <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}><LogOut size={14} /> Déconnexion</Button>}
      </header>
      {!ready ? null : !session ? <LoginForm /> : isAdmin === null ? <p className="admin-note">Chargement…</p> : isAdmin ? <CategoryEditor /> : <p className="admin-note">Ce compte n'a pas accès à l'espace gérant.</p>}
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('E-mail ou mot de passe incorrect.');
    setBusy(false);
  };
  return (
    <form className="admin-card" onSubmit={submit}>
      <h1>Espace gérant</h1>
      <p className="admin-note">Connectez-vous pour modifier la carte (y compris le menu du jour).</p>
      <div className="admin-field"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="admin-field"><Label htmlFor="pw">Mot de passe</Label><Input id="pw" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
      {error && <p className="admin-error">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full">Se connecter</Button>
    </form>
  );
}

type ItemDraft = { id?: string; name: string; description: string; price: string; position: number };
type CatDraft = { id: string; name: string; image_key: string; position: number; items: ItemDraft[]; collapsed: boolean };

function CategoryEditor() {
  const qc = useQueryClient();
  const { data } = useQuery(menuQuery);
  const [cats, setCats] = useState<CatDraft[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setCats(data.map((c: MenuCategory, idx: number) => ({
      id: c.id, name: c.name, image_key: c.imageKey ?? '', position: idx, collapsed: c.id !== 'menu-du-jour',
      items: c.groups.flatMap(g => g.items).map((it, i) => ({ id: `tmp-${c.id}-${i}`, name: it.name, description: it.description ?? '', price: String(it.price), position: i })),
    })));
  }, [data]);

  const toggle = (id: string) => setCats(cs => cs.map(c => c.id === id ? { ...c, collapsed: !c.collapsed } : c));
  const updateCat = (id: string, patch: Partial<CatDraft>) => setCats(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  const updateItem = (catId: string, idx: number, patch: Partial<ItemDraft>) => setCats(cs => cs.map(c => c.id === catId ? { ...c, items: c.items.map((it, j) => j === idx ? { ...it, ...patch } : it) } : c));
  const addItem = (catId: string) => setCats(cs => cs.map(c => c.id === catId ? { ...c, items: [...c.items, { name: '', description: '', price: '', position: c.items.length }] } : c));
  const removeItem = (catId: string, idx: number) => setCats(cs => cs.map(c => c.id === catId ? { ...c, items: c.items.filter((_, j) => j !== idx) } : c));
  const moveItem = (catId: string, idx: number, dir: -1 | 1) => setCats(cs => cs.map(c => {
    if (c.id !== catId) return c;
    const items = [...c.items];
    const ni = idx + dir;
    if (ni < 0 || ni >= items.length) return c;
    const a = items[idx];
    const b = items[ni];
    if (!a || !b) return c;
    items[idx] = b;
    items[ni] = a;
    return { ...c, items };
  }));

  const addCategory = () => {
    const id = prompt('ID de la catégorie (ex: wraps, salades-ventas) ?');
    if (!id) return;
    const name = prompt('Nom affiché ?') ?? id;
    setCats(cs => [...cs, { id: id.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'), name, image_key: '', position: cs.length, collapsed: false, items: [] }]);
  };

  const save = async () => {
    setBusy(true); setMsg('');
    try {
      for (const [pos, c] of cats.entries()) {
        const { error: ce } = await supabase.from('categories').upsert({ id: c.id, name: c.name, image_key: c.image_key || null, position: pos });
        if (ce) throw ce;
        const { data: existing } = await supabase.from('menu_items').select('id').eq('category_id', c.id);
        const keepIds = c.items.filter(i => i.id && !i.id.startsWith('tmp-')).map(i => i.id!);
        const toDelete = (existing ?? []).filter(e => !keepIds.includes(e.id)).map(e => e.id);
        if (toDelete.length) { const { error } = await supabase.from('menu_items').delete().in('id', toDelete); if (error) throw error; }
        for (const [ipos, it] of c.items.entries()) {
          if (!it.name.trim()) continue;
          const payload = { category_id: c.id, name: it.name.trim(), description: it.description.trim() || null, price: Number(it.price.replace(',', '.')) || 0, position: ipos };
          if (it.id && !it.id.startsWith('tmp-')) {
            const { error } = await supabase.from('menu_items').update(payload).eq('id', it.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('menu_items').insert(payload);
            if (error) throw error;
          }
        }
      }
      await qc.invalidateQueries({ queryKey: ['menu'] });
      setMsg('Carte enregistrée ✓');
    } catch (e) {
      setMsg(`Erreur: ${(e as Error).message}`);
    }
    setBusy(false);
  };

  return (
    <div className="admin-card admin-wide">
      <h1>Catégories de la carte</h1>
      <p className="admin-note">Le menu du jour est déjà déplié en haut. Modifiez, ajoutez, supprimez, réordonnez, puis enregistrez.</p>
      {cats.map(c => (
        <div key={c.id} className={`admin-cat-block ${c.id === 'menu-du-jour' ? 'admin-cat-highlight' : ''}`}>
          <div className="admin-cat-head" onClick={() => toggle(c.id)}>
            <span className="admin-cat-toggle">{c.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}</span>
            <span className="admin-cat-name">{c.id === 'menu-du-jour' ? '☀ ' : ''}{c.name} <small>({c.items.length})</small></span>
          </div>
          {!c.collapsed && (
            <div className="admin-cat-body">
              <div className="admin-cat-meta">
                <Input placeholder="Nom" value={c.name} onChange={e => updateCat(c.id, { name: e.target.value })} />
                <select value={c.image_key} onChange={e => updateCat(c.id, { image_key: e.target.value })}>
                  <option value="">— Image par défaut —</option>
                  {Object.keys(imageMap).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              {c.items.map((it, i) => (
                <div key={i} className="admin-row">
                  <Input placeholder="Nom du plat" value={it.name} onChange={e => updateItem(c.id, i, { name: e.target.value })} />
                  <Input placeholder="Prix (DT)" inputMode="decimal" value={it.price} onChange={e => updateItem(c.id, i, { price: e.target.value })} className="admin-price" />
                  <Input placeholder="Description (facultatif)" value={it.description} onChange={e => updateItem(c.id, i, { description: e.target.value })} className="admin-desc" />
                  <Button variant="ghost" size="icon" onClick={() => moveItem(c.id, i, -1)} disabled={i === 0}><ChevronUp size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => moveItem(c.id, i, 1)} disabled={i === c.items.length - 1}><ChevronDown size={14} /></Button>
                  <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => removeItem(c.id, i)}><Trash2 size={16} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem(c.id)}><Plus size={14} /> Ajouter un plat</Button>
            </div>
          )}
        </div>
      ))}
      <div className="admin-actions">
        <Button variant="outline" onClick={addCategory}><Plus size={16} /> Nouvelle catégorie</Button>
        <Button onClick={save} disabled={busy}><Save size={16} /> Enregistrer la carte</Button>
      </div>
      {msg && <p className="admin-note">{msg}</p>}
    </div>
  );
}
