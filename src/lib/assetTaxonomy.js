// Bogèst Visual Archive — DAM taxonomy.
// A single source of truth for the category structure, shared by the
// archive UI (Assets page, asset card, detail editor) and mirrored in the
// discovery vision prompt.

export const ASSET_TAXONOMY = {
  restaurant: { label: 'Restaurant', color: 'emerald', items: ['Exterior', 'Building', 'Entrance', 'Terrace', 'Garden', 'Parking', 'Signage', 'Surroundings', 'Aerial Views'] },
  interior: { label: 'Interior', color: 'sky', items: ['Dining Room', 'Private Dining', 'Bar', 'Wine Cellar / Wine Display', 'Kitchen', 'Fireplace', 'Hallway', 'Waiting Area', 'Restrooms', 'Decoration', 'Furniture', 'Lighting', 'Flooring', 'Ceiling'] },
  food: { label: 'Food', color: 'amber', items: ['Starters', 'Main Courses', 'Desserts', 'Cheese', "Children's Dishes", 'Seasonal Specials', 'Tasting Menu'] },
  ingredients: { label: 'Ingredients', color: 'orange', items: ['Belgian Blue Beef', 'Beef', 'Pork', 'Chicken', 'Fish', 'Shellfish', 'Vegetarian', 'Vegan'] },
  drinks: { label: 'Drinks', color: 'rose', items: ['Red Wine', 'White Wine', 'Rosé', 'Champagne', 'Cocktails', 'Beer', 'Coffee', 'Tea', 'Soft Drinks', 'Spirits'] },
  presentation: { label: 'Food Presentation', color: 'cyan', items: ['Close-up', 'Table Setting', 'Plating', 'Overhead View', 'Served at Table', 'Detail Shot'] },
  people: { label: 'People', color: 'indigo', items: ['Guests', 'Couples', 'Families', 'Groups', 'Children', 'Staff', 'Chef', 'Service Team', 'Owners', 'Team Photos'] },
  experience: { label: 'Guest Experience', color: 'pink', items: ['Hospitality', 'Dining', 'Celebration', 'Birthday', 'Anniversary', 'Romantic Dinner', 'Business Dinner', 'Toasting'] },
  atmosphere: { label: 'Atmosphere', color: 'violet', items: ['Daytime', 'Sunset', 'Evening', 'Night', 'Candlelight', 'Cozy', 'Luxury', 'Rustic', 'Modern', 'Busy', 'Quiet'] },
  seasons: { label: 'Seasons', color: 'teal', items: ['Spring', 'Summer', 'Autumn', 'Winter', 'Christmas', 'Easter', "Valentine's Day", "Mother's Day"] },
  events: { label: 'Events', color: 'fuchsia', items: ['Wine Tasting', 'Live Music', 'Corporate Event', 'Private Event', 'Press Event', 'Restaurant Opening'] },
  marketing: { label: 'Marketing', color: 'blue', items: ['Professional Photography', 'Website', 'Social Media', 'Advertisement', 'Flyer', 'Press Photography'] },
  locations: { label: 'Locations', color: 'lime', items: ['Hasselt', 'Borgloon', 'Heusden-Zolder'] },
  source: { label: 'Source', color: 'slate', items: ['Official Website', 'Google Maps', 'Tripadvisor', 'Instagram', 'Facebook', 'TikTok', 'Pinterest', 'Blog', 'News', 'Review Website'] },
  technical: { label: 'Technical', color: 'zinc', items: ['Landscape', 'Portrait', 'Square', 'High Resolution', 'Watermarked', 'Smartphone', 'Professional Camera'] },
  quality: { label: 'Quality', color: 'gold', items: ['Hero Image', 'Website Ready', 'Print Ready', 'Social Media Ready', 'High Brand Consistency', 'Excellent Composition', 'Excellent Lighting', 'High Visual Quality'] },
};

// Literal Tailwind classes so the JIT purger keeps them.
export const GROUP_COLOR_CLASSES = {
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  pink: 'bg-pink-500/15 text-pink-300 border-pink-500/25',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
  fuchsia: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  lime: 'bg-lime-500/15 text-lime-300 border-lime-500/25',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/25',
  zinc: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25',
  gold: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
};

const LEGACY_COLORS = {
  interiors: 'sky', gastronomy: 'amber', atmosphere: 'pink', architecture: 'emerald', branding: 'violet',
};
const LEGACY_GROUP = {
  interiors: 'interior', gastronomy: 'food', atmosphere: 'atmosphere', architecture: 'restaurant', branding: 'marketing',
};

export const TAXONOMY_GROUPS = Object.keys(ASSET_TAXONOMY);

export const ALL_CATEGORY_PATHS = TAXONOMY_GROUPS.flatMap((g) => ASSET_TAXONOMY[g].items.map((it) => `${g}/${it}`));

export function groupKeyOf(path) { return String(path || '').split('/')[0]; }
export function subLabelOf(path) { return String(path || '').split('/').slice(1).join('/'); }
export function groupLabel(groupKey) { return ASSET_TAXONOMY[groupKey]?.label || groupKey; }

export function categoryLabel(path) {
  const g = groupKeyOf(path);
  const s = subLabelOf(path);
  return s ? `${ASSET_TAXONOMY[g]?.label || g} · ${s}` : (ASSET_TAXONOMY[g]?.label || path);
}

export function colorClassForBadge(groupOrLegacy) {
  const color = ASSET_TAXONOMY[groupOrLegacy]?.color || LEGACY_COLORS[groupOrLegacy] || 'slate';
  return GROUP_COLOR_CLASSES[color];
}

export function deriveOrientation(w, h) {
  if (!w || !h) return 'unknown';
  const r = w / h;
  if (r > 1.15) return 'landscape';
  if (r < 0.87) return 'portrait';
  return 'square';
}

// Groups an asset belongs to (from multi-categories, falling back to the
// legacy single primary_category for older records).
export function assetGroups(asset) {
  const set = new Set();
  for (const c of asset.categories || []) set.add(groupKeyOf(c));
  if (set.size === 0 && asset.primary_category && LEGACY_GROUP[asset.primary_category]) {
    set.add(LEGACY_GROUP[asset.primary_category]);
  }
  return set;
}

// Legacy single-bucket mapping (kept so old agents/filters keep working).
export function legacyPrimaryCategory(categories = []) {
  const has = (g) => categories.some((c) => String(c).startsWith(g + '/'));
  if (has('food') || has('ingredients') || has('drinks') || has('presentation')) return 'gastronomy';
  if (has('restaurant') || has('interior') || has('locations')) return 'interiors';
  if (has('atmosphere') || has('experience') || has('people') || has('seasons')) return 'atmosphere';
  return 'branding';
}