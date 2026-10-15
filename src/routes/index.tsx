import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Download, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, formatPrice } from '@/lib/menu';
import logo from '@/assets/mabillon-logo.png';
import menuPdf from '@/assets/carte-mabillon.pdf';

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
  const [active, setActive] = useState('');
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-120px 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('.menu-section').forEach(section => observer.observe(section));
    const onScroll = () => { setShowTop(window.scrollY > 600); if (window.scrollY < 400) setActive(''); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
  return (
    <div id="top">
      <header className="site-header">
        <div className="header-top">
          {/* Logo removed from navbar and replaced with text link */}
          <a href="#top" aria-label="Le Mabillon — accueil" className="header-brand">Le Mabillon</a>
          <div className="header-actions">
            <span className="menu-label">Resto & Café · Tunis</span>
            <Button asChild variant="ghost" size="icon">
              <a href={menuPdf} target="_blank" rel="noreferrer" aria-label="Ouvrir la carte PDF" title="La carte en PDF">
                <Download />
              </a>
            </Button>
          </div>
        </div>
        <div className="nav-wrap">
          <nav className="category-nav" aria-label="Catégories du menu">
            {categories.map(category => <a key={category.id} href={`#${category.id}`} className={active === category.id ? 'active' : ''} aria-current={active === category.id ? 'location' : undefined}>{category.name}</a>)}
          </nav>
        </div>
      </header>
      
      {/* Hero Logo Section */}
      <div className="logo-hero">
        <img className="hero-logo" src={logo} alt="Le Mabillon Resto & Café" fetchPriority="high" />
      </div>

      <main className="menu-content">
        <div className="section-intro">
          <div>
            <p className="eyebrow">À la carte</p>
            <h1>Notre menu</h1>
          </div>
          <span className="category-count"><Grid2X2 size={13} />12 catégories</span>
        </div>
        <div className="category-grid" id="categories">
          {categories.map((category, index) => 
            <a className="category-tile" href={`#${category.id}`} key={category.id} aria-label={`Voir ${category.name}`}>
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
        
        <div className="menu-divider">
          <p>La carte du Mabillon</p>
          <ArrowDown size={16} className="mx-auto mt-3 text-primary" />
        </div>

        {categories.map((category, index) => 
          <section id={category.id} key={category.id} className="menu-section" aria-labelledby={`${category.id}-heading`}>
            <div className="menu-section-header">
              <div className="min-w-0">
                <p className="section-number">{String(index + 1).padStart(2, '0')} / LA CARTE</p>
                <h2 id={`${category.id}-heading`}>{category.name}</h2>
              </div>
              <img className="section-thumbnail" src={category.image} alt="" width={100} height={76} loading="lazy" />
            </div>
            <div className="menu-groups">
              {category.groups.map(group => 
                <div key={group.name} className="menu-group">
                  {(category.groups.length > 1 || group.name !== category.name) && <h3>{group.name}</h3>}
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
        )}
      </main>

      <footer className="site-footer">
        <a href="#top" aria-label="Retour en haut">
          <img src={logo} alt="Le Mabillon" loading="lazy" />
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
