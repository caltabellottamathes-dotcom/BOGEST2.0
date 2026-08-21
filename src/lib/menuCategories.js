// Categorie- en vestigingsopties voor het menukaart-beheer. Gedeeld tussen de
// beheerpagina en de item-editor zodat de labels op één plek staan.
export const MENU_CATEGORIES = [
  { key: 'signature', label: 'Signature' },
  { key: 'starters', label: 'Voorgerechten' },
  { key: 'beef', label: 'Rundvlees' },
  { key: 'masters', label: 'Masters of Meat' },
  { key: 'chicken', label: 'Kip' },
  { key: 'fish', label: 'Vis' },
  { key: 'veggie', label: 'Vegetarisch' },
  { key: 'pork', label: 'Varken' },
  { key: 'classics', label: 'Klassiekers' },
  { key: 'sides', label: 'Bijgerechten' },
  { key: 'sauces', label: 'Sauzen' },
  { key: 'wines', label: 'Wijnen' },
  { key: 'beers', label: 'Bieren' },
  { key: 'drinks', label: 'Dranken' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'kids', label: 'Kinderen' },
  { key: 'seasonal', label: 'Seizoensgebonden' },
];

export const MENU_LOCATIONS = [
  { key: 'hasselt', label: 'Hasselt' },
  { key: 'borgloon', label: 'Borgloon' },
  { key: 'heusden-zolder', label: 'Heusden-Zolder' },
];

export const categoryLabel = (key) => MENU_CATEGORIES.find((c) => c.key === key)?.label || key;