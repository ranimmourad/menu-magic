# Le Mabillon — Resto & Café

La carte en ligne du Mabillon, Resto & Café — 17 rue Abdelaziz Mastouri, 1013 Menzah 9, Tunis.

Une seule page, pensée d'abord pour le téléphone : le logo, les catégories en images, puis la carte complète classée par catégorie. Les prix sont en dinars tunisiens.

## Contenu

- `src/lib/menu.ts` — la source de la carte : catégories, groupes, plats et prix. C'est ici qu'on ajoute, retire ou modifie un plat.
- `src/lib/menu.test.ts` — vérifie que les prix et les catégories de la carte restent cohérents.
- `src/styles.css` — palette, typographies et mise en page.
- `src/routes/index.tsx` — la page de la carte.
- `public/` — l'icône de l'onglet et l'icône d'accueil.

## Développement

Vous avez besoin de Node.js et npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
