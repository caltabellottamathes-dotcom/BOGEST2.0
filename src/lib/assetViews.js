// Curated, human-friendly views for browsing the Bogèst visual archive.
// Each view maps to one or more taxonomy groups (src/lib/assetTaxonomy) so an
// image's multi-category assignment still drives filtering, but the visitor
// sees a small, meaningful set of tabs instead of 16 raw groups.

export const ASSET_VIEWS = [
  { key: 'all', label: 'Alles', groups: null },
  { key: 'food', label: 'Gerechten', groups: ['food', 'ingredients', 'presentation'] },
  { key: 'drinks', label: 'Dranken', groups: ['drinks'] },
  { key: 'interior', label: 'Interieur', groups: ['interior'] },
  { key: 'atmosphere', label: 'Sfeer & mensen', groups: ['atmosphere', 'experience', 'people', 'seasons'] },
  { key: 'exterior', label: 'Buiten & restaurant', groups: ['restaurant', 'locations'] },
  { key: 'events', label: 'Evenementen', groups: ['events'] },
  { key: 'videos', label: "Video's", groups: null },
];

export const LOCATIONS = [
  { key: 'all', label: 'Alle locaties' },
  { key: 'hasselt', label: 'Hasselt' },
  { key: 'borgloon', label: 'Borgloon' },
  { key: 'heusden-zolder', label: 'Heusden-Zolder' },
];