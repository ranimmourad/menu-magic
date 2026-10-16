import r_formules from '@/assets/r-formules.jpg';
import r_jus from '@/assets/r-jus.jpg';
import r_milkshakes from '@/assets/r-milkshakes.jpg';
import r_patisseries from '@/assets/r-patisseries.jpg';
import r_viennoiseries from '@/assets/r-viennoiseries.jpg';
import r_glaces from '@/assets/r-glaces.jpg';
import r_paninis from '@/assets/r-paninis.jpg';
import r_croques from '@/assets/r-croques.jpg';
import r_baguettes from '@/assets/r-baguettes.jpg';
import r_makloub from '@/assets/r-makloub.jpg';
import breakfast from '@/assets/cafe-0.jpg';
import coffee from '@/assets/cafe-1.jpg';
import drinks from '@/assets/cafe-2.jpg';
import sweets from '@/assets/cafe-3.jpg';
import crepes from '@/assets/cafe-4.jpg';
import burgers from '@/assets/cafe-5.jpg';
import sandwiches from '@/assets/restaurant-0.jpg';
import eggs from '@/assets/restaurant-1.jpg';
import salads from '@/assets/restaurant-2.jpg';
import pizza from '@/assets/restaurant-3.jpg';
import pasta from '@/assets/restaurant-4.jpg';
import mains from '@/assets/restaurant-5.jpg';

export type MenuItem = { name: string; price: number; description?: string };
type Row = [string, number, string?];
const group = (name: string, rows: Row[]) => ({ name, items: rows.map(([name, price, description]) => ({ name, price, description })) });
export const formatPrice = (price: number) => new Intl.NumberFormat('fr-TN', { maximumFractionDigits: 1 }).format(price);
const rawCategories = [
  { id: 'petits-dejeuners', name: 'Petits déjeuners', image: breakfast, groups: [group('Petits déjeuners', [
    ['Basique',8,'Café, jus, ½ eau, viennoiserie'],['Week End',11.5,'Café, jus, ½ eau, viennoiserie, omelette'],['Belge',11.5,'Café, jus, ½ eau, viennoiserie, crêpe'],['Tunisien',16,'Café, jus, ½ eau, mlawi, ricotta miel, chamia, mtabga, ojja'],['Tout salé',22,"Café, jus, ½ eau, omelette, pain farci, assiette charcuterie-fromages, œufs à l’italienne"],['Complet',20,'Café, jus, ½ eau, viennoiserie, pancake, omelette, assiette charcuterie-fromage'],['Américain',22,'Café, jus, ½ eau, viennoiserie, pancake, breakfast sandwich, œufs au bacon, assiette charcuterie-fromage']
  ]),group('Formules gourmandes', [['Café gourmand',11,'Pâtisserie + café'],['Hiver glacé',11.5,'Pâtisserie + chocolat chaud'],['Tonus sucré',11.5,'Pâtisserie + jus de fruits']])] },
  { id: 'boissons-chaudes', name: 'Boissons chaudes', image: coffee, groups: [group('Boissons chaudes', [
    ['Express',3.2],['Capucin',3.4],['Américain',3.4],['Direct',3.8],['Café spécial',5.4],['Café glacé',3.5],['Chocolat au lait',3.5],['Chocolat chaud Chantilly',6.5],['Chocolat chaud',5.5],['Café italien',7],['Thé infusion',3.4],['Thé à la menthe',3],['Thé aux amandes',5.5],['Thé aux pignons',7.5],['Frappucino',7.5],['Cappuccino',6.5],['Mokkaccino',7.5],['Nocciolino',7.5,'Nutella, café, chantilly'],['Expresso panna',5.5,'Express, Chantilly'],['Mokkaccino',6]
  ])] },
  { id: 'boissons-fraiches', name: 'Boissons fraîches', image: drinks, groups: [group('Boissons fraîches', [['Eau minérale',3],['Sodas, pétillante',3.5],['Eau demi',1.7],['Energy drink',7.5]]),group('Jus de fruits & smoothies', [
    ["Citronnade, jus d’orange, jus de fraise",5],['Cocktail de fruits',6.5],['Lait de poule, lait de poussin',6],['Jus de fruits',6,'Pomme, pêche, poire, selon saison'],['Mojito',7.5],['Mojito Energy',12],['Smoothie fraise banane',6],['Smoothie banane café chocolat',6.5]
  ]),group('Milk shakes', [['Milk shake',6,'Parfum au choix'],['Milk shake Nutella',10],['Milk shake Mabillon',7.5,'Banane + parfum au choix']])] },
  { id: 'douceurs', name: 'Douceurs & desserts', image: sweets, groups: [group('Crêpes, gaufres ou pancakes sucrés', [['Chocolat',9.5],['Chocolat banane',11],['Chocolat noisette',11],['Chocolat amandes',11],['Nutella',13.5],['Caramel beurre salé',9.5],['Chamia, ricotta',11],['Supplément glace et Chantilly',2]]),group('Pâtisseries', [['Fondant au chocolat',6.5],['Mousse au chocolat',6],['Pâtisserie maison',7],['Tiramisu',10],['Tarte maison',7],['Cheese-cake',10],['Pizza au Nutella',14]]),group('Viennoiseries', [['Viennoiserie',3.2],['Cake maison',3.5],['Toasts',3,'Beurre confiture, Nutella ou caramel'],['Mlawi ricotta miel et chamia',3]]),group('Glaces', [['1 boule',4.5,'Au choix, sauce chocolat ou caramel, Chantilly, amandes'],['2 boules',8,'Au choix, sauce chocolat ou caramel, Chantilly, amandes'],['3 boules',12,'Au choix, sauce chocolat ou caramel, Chantilly, amandes'],['Hot Fudge',7,'Glace vanille, sauce chocolat, Chantilly, amandes'],['Banana Split',13,'Banane, 3 boules au choix, sauce chocolat, Chantilly, amandes']])] },
  { id: 'crepes-salees', name: 'Crêpes salées', image: crepes, groups: [group('Crêpes salées', [
    ['La basique',9,'Mozzarella'],['La Classique',10.5,'Thon, jambon, poulet ou champignons et mozzarella'],['La Méditerranée',11.5,'Mozzarella, thon ou jambon ou poulet, œuf'],['La Mabillon',12.5,'Thon ou jambon ou poulet, béchamel, champignons'],['La Complète',12.5,'Mozzarella, thon ou poulet, champignons, jambon, œuf'],['La tunisienne',12,'Mozzarella, thon, méchouia, œuf'],["L’italienne",14,'Mozzarella, ricotta, épinards, bresaola'],['La savoyarde',15,'Mozzarella, bacon, raclette'],['La 4 fromages',15],['La nordique',15,'Saumon, ricotta'],['Supplément fromage, bacon, bresaola, frites',3],['Supplément champignons, jambon, œuf',1.5]
  ])] },
  { id: 'burgers-paninis', name: 'Burgers & paninis', image: burgers, groups: [group('Hamburgers', [['Classic',13.5,'Steak haché, oignons caramélisés, bacon de bœuf, raclette'],['Double',17],['Kentucky',13,'Poulet frit, oignons caramélisés, bacon de bœuf, raclette']]),group('Paninis', [['Thon, jambon ou poulet',10.5],['Le tunisien',11,'Thon, méchouia'],['Le romano',12.5,'Raclette, bresaola'],['Nordique',14.5,'Saumon, fromage']]),group('Croques', [['Croque-monsieur',10],['Croque madame',12],['Croque poulet',11],['Croque italien',14,'Bresaola, raclette'],['Grilled cheese 4 fromages',16]])] },
  { id: 'sandwichs', name: 'Sandwichs & makloub', image: sandwiches, groups: [group('Sandwichs', [
    ['Tunisien',11.5,'Thon et salades'],['Chicken',11.5,'Poulet grillé, salades'],['Complet',12,'Escalope et jambon'],['Américan full',14,'Steak haché + œuf'],['Parisien',15,'Bresaola, tomate, laitue, œuf dur, camembert ou gruyère'],['Italien',14.5,'Pesto, poulet, fromage'],['Philadelphia',14,'Steak ou steak haché ou poulet, poivrons et oignons sautés, fromage'],['Merguez',13],['Saverioni',15,'Laitue, tomates, mayonnaise, bresaola, raclette'],['Chivito',18,'Steak, laitue, tomates, oignons, poivrons, jambon, mozzarella, bacon, œuf']
  ]),group('Baguettes farcies', [['Classic',13,'Escalope ou thon ou jambon, mozzarella et légumes sautés'],['Steak',15.5,'Viande, jambon, mozzarella et légumes sautés'],['Steak haché',15.5,'Steak haché, jambon, mozzarella et légumes sautés'],['Merguez',15.5],['Champignons fromage',16],['Pesto poulet fromage',17],['Mare Monti',20,'Mozzarella, champignons, fruits de mer']]),group('Makloub', [['Escalope ou thon ou jambon',11.5],['Steak',13.5],['Steak haché',13.5],['Libanais',13],['Tacos sauce fromagère',13]])] },
  { id: 'omelettes', name: 'Omelettes & œufs', image: eggs, groups: [group('Omelettes & œufs', [
    ['Basique',9,'À la mozzarella'],['Classique',12,'Thon, jambon, poulet ou champignons, mozzarella'],['Tunisienne',12.5,'Thon ou jambon ou poulet, méchouia et mozzarella'],['Forestière',15,'Bacon, pommes de terre, champignons, raclette et mozzarella'],['Complète',13.5,'Thon ou jambon ou poulet, champignons, mozzarella'],['Mare Monti',18,'Mozzarella, champignons, fruits de mer'],['Mabillon',13.5,'Thon ou poulet, jambon, champignons, tomate, mozzarella'],['Œufs au plat + frites',7],['Œufs brouillés + frites',7],['Œufs au bacon',9],['Breakfast Sandwich',5.5],['Ojja nature',8],['Ojja merguez',12.5],['Ojja fruits de mer',20]
  ])] },
  { id: 'salades', name: 'Salades', image: salads, groups: [group('Salades', [['Salade Bistrot',14,'Laitue, tomates, pommes de terre, bacon, maïs, gruyère, œuf'],['Salade César',13,'Laitue, croûtons, œuf, parmesan'],['Salade Mabillon',11.5,'Crudités, jambon, thon ou poulet, fromage, œuf'],['Salade italienne',14,'Légumes grillés, fromage, bresaola, œuf']])] },
  { id: 'pizzas', name: 'Pizzas', image: pizza, groups: [group('Pizzas', [
    ['Marguerita',13.5],['Végétarienne',15,'Sauce tomate, tomates fraîches, poivrons, oignons, champignons, olives'],['Neptune',16,'Tomate, mozzarella, thon, olives'],['Savoyarde',20,'Oignons, bacon, pommes de terre, champignons, sauce blanche, mozzarella, raclette ou gruyère'],['Bresaola',20,'Tomate, champignons, mozzarella, bresaola'],['Pollo',16.5,'Tomate, mozzarella, poulet, olives, champignons'],['Nordique',20,'Ricotta, saumon en sauce blanche'],['Calzone',20,'Ricotta, mozzarella, bacon ou thon ou bresaola'],['Napolitaine',15.5,'Anchois, câpres, mozzarella'],['Tunisienne',16.5,'Mozzarella, méchouia, merguez'],['Fruits de mer',27],['Quatre fromages',22]
  ])] },
  { id: 'pates', name: 'Pâtes & riz', image: pasta, groups: [group('Pâtes & riz', [
    ['Penne all’arrabiata',12],['Spaghetti bolognaise',17],['Penne putanesca',15],['Spaghetti boscaiola',14,'Champignons sautés, crème'],['Spaghetti aux fruits de mer',27],['Penne Mare e Monti',27,'Fruits de mer, champignons, sauce blanche'],['Fell au poisson',17],['Lasagnes',18.5],['Lasagnes aux fruits de mer',27],['Penne carbonara au bacon',21],['Penne au poulet et champignons',15],['Riz au poulet',15],['Riz mare monti',27,'Champignons sautés, crème'],['Penne 4 fromages',22],["Mac’n’cheese poulet ou bacon",22,'Macaroni au four, béchamel et fromage, gratiné au four']
  ])] },
  { id: 'plats', name: 'Nos plats', image: mains, groups: [group('Nos plats', [
    ['Poisson grillé',17],['Fish and chips',18],['Poulet au grill',17],['Gratin de fruits de mer',25],['Complet escalope',17,'Escalope grillée, œuf au plat, salade, riz ou pâtes, frites'],['Complet escalope panée',18.5],['Complet Cordon bleu',20],['Complet Steak',20],['Émincé de poulet',17,'Oignons, poivrons et champignons'],['Émincé de veau',21,'Oignons, poivrons et champignons'],['Escalope de poulet à la crème',18,'Sauce moutarde, poivre ou champignons'],['Steak à la crème',24,'Sauce moutarde, poivre ou champignons']
  ])] },
];
const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/œ/g, 'oe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const overrides: Record<string, string> = { 'formules-gourmandes': r_formules, 'jus-de-fruits-smoothies': r_jus, 'milk-shakes': r_milkshakes, 'patisseries': r_patisseries, 'viennoiseries': r_viennoiseries, 'glaces': r_glaces, 'paninis': r_paninis, 'croques': r_croques, 'baguettes-farcies': r_baguettes, 'makloub': r_makloub };
// Each rubrique of the printed carte becomes its own category.
export const categories = rawCategories.flatMap(c => c.groups.map(g => ({ id: slug(g.name), name: g.name, image: overrides[slug(g.name)] ?? c.image, groups: [g] })));
