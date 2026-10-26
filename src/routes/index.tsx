import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, ArrowUpRight, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories as menuCategories, formatPrice } from '@/lib/menu';
import { dailyMenuQuery } from '@/lib/daily-menu';
import logo from '@/assets/mabillon-logo.png';
import dailyImg from '@/assets/menu-du-jour.jpg';

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Le Mabillon — La carte | Resto & Café' },
    { name: 'description', content: 'Découvrez la carte du Mabillon à Menzah 9, Tunis : petits déjeuners, cafés, crêpes, pizzas, pâtes et douceurs. Tous les prix en dinars tunisiens.' },
    { property: 'og:title', content: 'Le Mabillon — Resto & Café' },
    { property: 'og:description', content: 'Toute notre carte, du petit déjeuner aux douceurs, à Menzah 9, Tunis.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  // C'est cette variable qui controle ce qui s'affiche en bas. 
  // Au départ, elle est null (rien ne s'affiche).
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const { data: dailyItems = [] } = useQuery(dailyMenuQuery);
  const categories = [
    { id: 'menu-du-jour', name: 'Menu du jour', image: dailyImg, groups: [{ name: 'Menu du jour', items: dailyItems.map(d => ({ name: d.name, price: d.price, description: d.description ?? undefined })) }] },
    ...menuCategories,
  ];

  useEffect(() => {
    const onScroll = () => { setShowTop(window.scrollY > 600); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); };
  }, []);

  const handleSelect = (id: string) => {
    setActiveCategory(id);
  };

  // On récupère l'index original pour garder le bon numéro d'ordre
  const selectedIndex = categories.findIndex(c => c.id === activeCategory);

  return (
    <div id="top">
      <header className="site-header">
        <div className="header-top">
          <a href="#top" aria-label="Le Mabillon — accueil">
            <img className="header-logo" src={logo} alt="Le Mabillon Resto & Café" />
          </a>
          <div className="header-actions">
            <span className="menu-label">Resto & Café · Tunis</span>
          </div>
        </div>
        <div className="nav-wrap">
          <nav className="category-nav" aria-label="Catégories du menu">
            {categories.map(category => 
              <a 
                key={category.id} 
                href="#menu-display" 
                className={activeCategory === category.id ? 'active' : ''} 
                aria-current={activeCategory === category.id ? 'location' : undefined}
                onClick={() => handleSelect(category.id)}
              >
                {category.name}
              </a>
            )}
          </nav>
        </div>
      </header>
      
      <div className="logo-hero">
        <img className="hero-logo" src={logo} alt="Le Mabillon Resto & Café" fetchPriority="high" />
      </div>

      {dailyItems.length > 0 && (
        <section className="daily-menu" aria-labelledby="daily-heading">
          <p className="eyebrow">Aujourd’hui</p>
          <h2 id="daily-heading">Menu du jour</h2>
          <div className="menu-items">
            {dailyItems.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-row">
                  <h4>{item.name}</h4>
                  <p className="item-price">{formatPrice(item.price)}<span>DT</span></p>
                </div>
                {item.description && <p>{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="menu-content">
        <div className="section-intro">
          <div>
            <p className="eyebrow">À la carte</p>
            <h1>Notre menu</h1>
          </div>
          <span className="category-count"><Grid2X2 size={13} />{categories.length} catégories</span>
        </div>
        
        <div className="category-grid" id="categories">
          {categories.map((category, index) => 
            <a 
              className="category-tile" 
              href="#menu-display" 
              key={category.id} 
              aria-label={`Voir ${category.name}`}
              onClick={() => handleSelect(category.id)}
            >
              <img src={category.image} alt={category.name} width={760} height={634} loading={index < 2 ? 'eager' : 'lazy'} />
              <div className="tile-caption">
                <div className="min-w-0">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h2>{category.name}</h2>
                </div>
                <div className="tile-arrow"><ArrowUpRight size={16} /></div>
              </div>
            </a>
          )}
        </div>
        
        {/* C'est ici que la magie opère */}
        <div id="menu-display" style={{ paddingTop: '40px' }}></div>

        {activeCategory ? (
          // Si une rubrique est choisie, on n'affiche QUE ses plats
          <section className="menu-section" aria-labelledby={`${activeCategory}-heading`}>
            <div className="menu-section-header">
              <div className="min-w-0">
                <p className="section-number">{String(selectedIndex + 1).padStart(2, '0')} / LA CARTE</p>
                <h2 id={`${activeCategory}-heading`}>{categories[selectedIndex].name}</h2>
              </div>
              <img className="section-thumbnail" src={categories[selectedIndex].image} alt="" width={100} height={76} loading="lazy" />
            </div>
            <div className="menu-groups">
              {categories[selectedIndex].groups.map(group => 
                <div key={group.name} className="menu-group">
                  {(categories[selectedIndex].groups.length > 1 || group.name !== categories[selectedIndex].name) && <h3>{group.name}</h3>}
                  <div className="menu-items">
                    {group.items.map((item, itemIndex) => 
                      <div key={`${item.name}-${itemIndex}`} className="menu-item">
                        <div className="item-row">
                          <h4>{item.name}</h4>
                          <p className="item-price">{formatPrice(item.price)}<span>DT</span></p>
                        </div>
                        {item.description && <p>{item.description}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          // Si aucune rubrique n'est choisie, on affiche juste un message d'attente
          <div className="menu-divider">
            <p>Veuillez choisir une rubrique</p>
            <ArrowDown size={16} className="mx-auto mt-3 text-primary" />
          </div>
        )}
      </main>

      <footer className="site-footer">
        <a href="#top" aria-label="Retour en haut">
          <img className="footer-logo" src={logo} alt="Le Mabillon" loading="lazy" />
        </a>
        <address>17 rue Abdelaziz Mastouri<br />1013 Menzah 9, Tunis</address>
        <p className="photo-note">Prix en dinars tunisiens · Photos d’illustration</p>
      </footer>

      {showTop && 
        <Button asChild variant="default" size="icon" className="back-top">
          <a href="#categories" aria-label="Retour aux catégories" title="Retour aux catégories">
            <ArrowUp />
          </a>
        </Button>
      }
    </div>
  );
}
