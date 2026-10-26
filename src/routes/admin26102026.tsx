import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { Trash2, Plus, LogOut, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dailyMenuQuery, type DailyItem } from '@/lib/daily-menu';
import logo from '@/assets/mabillon-logo.png';

export const Route = createFileRoute('/admin26102026')({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Espace gérant — Le Mabillon' },
    { name: 'description', content: 'Gestion du menu du jour du Mabillon.' },
    { name: 'robots', content: 'noindex' },
    { property: 'og:title', content: 'Espace gérant — Le Mabillon' },
    { property: 'og:description', content: 'Gestion du menu du jour.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
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
      {!ready ? null : !session ? <LoginForm /> : isAdmin === null ? <p className="admin-note">Chargement…</p> : isAdmin ? <Editor /> : (
        <p className="admin-note">Ce compte n'a pas accès à l'espace gérant.</p>
      )}
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
      <p className="admin-note">Connectez-vous pour modifier le menu du jour.</p>
      <div className="admin-field"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="admin-field"><Label htmlFor="pw">Mot de passe</Label><Input id="pw" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
      {error && <p className="admin-error">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full">Se connecter</Button>
    </form>
  );
}

type Draft = { id?: string; name: string; description: string; price: string };

function Editor() {
  const qc = useQueryClient();
  const { data } = useQuery(dailyMenuQuery);
  const [rows, setRows] = useState<Draft[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setRows(data.map((d: DailyItem) => ({ id: d.id, name: d.name, description: d.description ?? '', price: String(d.price) })));
  }, [data]);

  const update = (i: number, patch: Partial<Draft>) => setRows(r => r.map((row, j) => j === i ? { ...row, ...patch } : row));

  const save = async () => {
    setBusy(true); setMsg('');
    const clean = rows.filter(r => r.name.trim());
    const keep = clean.filter(r => r.id).map(r => r.id!);
    const removed = (data ?? []).filter(d => !keep.includes(d.id)).map(d => d.id);
    try {
      if (removed.length) { const { error } = await supabase.from('daily_menu_items').delete().in('id', removed); if (error) throw error; }
      for (const [position, r] of clean.entries()) {
        const payload = { name: r.name.trim(), description: r.description.trim() || null, price: Number(r.price.replace(',', '.')) || 0, position };
        const { error } = r.id
          ? await supabase.from('daily_menu_items').update(payload).eq('id', r.id)
          : await supabase.from('daily_menu_items').insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ['daily-menu'] });
      setMsg('Menu du jour enregistré ✓');
    } catch {
      setMsg("L'enregistrement a échoué, réessayez.");
    }
    setBusy(false);
  };

  return (
    <div className="admin-card admin-wide">
      <h1>Menu du jour</h1>
      <p className="admin-note">Ajoutez, modifiez ou supprimez les plats, puis enregistrez.</p>
      {rows.length === 0 && <p className="admin-note">Aucun plat pour l'instant.</p>}
      {rows.map((r, i) => (
        <div key={r.id ?? `new-${i}`} className="admin-row">
          <Input placeholder="Nom du plat" value={r.name} onChange={e => update(i, { name: e.target.value })} />
          <Input placeholder="Prix (DT)" inputMode="decimal" value={r.price} onChange={e => update(i, { price: e.target.value })} className="admin-price" />
          <Input placeholder="Description (facultatif)" value={r.description} onChange={e => update(i, { description: e.target.value })} className="admin-desc" />
          <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => setRows(rs => rs.filter((_, j) => j !== i))}><Trash2 size={16} /></Button>
        </div>
      ))}
      <div className="admin-actions">
        <Button variant="outline" onClick={() => setRows(r => [...r, { name: '', description: '', price: '' }])}><Plus size={16} /> Ajouter un plat</Button>
        <Button onClick={save} disabled={busy}><Save size={16} /> Enregistrer</Button>
      </div>
      {msg && <p className="admin-note">{msg}</p>}
    </div>
  );
}
