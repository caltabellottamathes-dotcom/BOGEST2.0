// Deterministic Recommendation Engine (Section 4.2).
//
// Hard filters → soft scoring → ranking → diversity pass.
// Weights are config-driven (not hard-coded magic numbers in the scorer).

export const WEIGHTS = {
  occasion: 3.0,
  weather: 1.5,
  season: 1.5,
  categoryMatch: 2.5,
  popularity: 1.0,
  newness: 0.8,
  budget: 1.2,
  party: 1.0,
};

const OCCASION_CATS = {
  romantic: ['signature', 'beef'],
  family: ['kids', 'chicken', 'beef'],
  business: ['beef', 'signature'],
  solo: ['beef', 'chicken', 'fish'],
  casual: ['beef', 'chicken', 'fish', 'veggie'],
};
const OCCASION_KEYWORDS = {
  romantic: ['chateaubriand', 'côte', 'os'],
  family: ['vol au vent', 'boulet', 'kroket', 'kip'],
  business: ['filet pur', 'ribeye'],
};

const WEATHER_CATS = { warm: ['fish', 'chicken', 'veggie'], cold: ['beef', 'sides'], rainy: ['beef', 'sides'] };
const WEATHER_KEYWORDS = { cold: ['stoofvlees', 'spare ribs', 'rib'], warm: ['scampi', 'zalm', 'kip'] };

const SEASON_CATS = { spring: ['fish', 'chicken', 'veggie'], summer: ['fish', 'chicken', 'veggie'], autumn: ['beef', 'signature'], winter: ['beef', 'sides'] };

const CATEGORY_MAP = { beef: ['beef', 'signature'], fish: ['fish'], chicken: ['chicken'], veggie: ['veggie'], pork: ['beef'] };

const MAIN_CATS = ['signature', 'beef', 'chicken', 'fish', 'veggie'];

function norm(s) { return (s || '').toString().toLowerCase(); }

export function recommend(items, req) {
  const { preferences = {}, exclude = [], limit = 3 } = req || {};
  let pool = (items || []).filter((i) => MAIN_CATS.includes(i.category));

  // --- Hard filters ---
  if (preferences.dietary === 'veggie' || preferences.dietary === 'vegan') {
    pool = pool.filter((i) => i.category === 'veggie');
  }
  if (preferences.allergies) {
    const tokens = norm(preferences.allergies).split(/[\s,]+/).filter((k) => k.length > 2);
    pool = pool.filter((i) => !tokens.some((k) => norm(`${i.item_name} ${i.description}`).includes(k)));
  }
  if (preferences.location) {
    pool = pool.filter((i) => !i.available_locations || i.available_locations.length === 0 || i.available_locations.includes(preferences.location));
  }
  if (preferences.budget) {
    pool = pool.filter((i) => !i.price || i.price <= preferences.budget);
  }
  if (exclude && exclude.length) {
    const ex = exclude.map(norm);
    pool = pool.filter((i) => !ex.includes(norm(i.item_name)));
  }

  const occ = preferences.occasion && OCCASION_CATS[preferences.occasion] ? preferences.occasion : 'casual';
  const weather = preferences.weather;
  const season = preferences.season;
  const meatPref = preferences.meatPreference;

  // --- Soft scoring ---
  const scored = pool.map((i) => {
    let score = 0;
    const reasons = [];
    const name = norm(i.item_name);
    const desc = norm(i.description || '');

    if (OCCASION_CATS[occ].includes(i.category)) { score += WEIGHTS.occasion; reasons.push('past bij de gelegenheid'); }
    if ((OCCASION_KEYWORDS[occ] || []).some((k) => name.includes(k) || desc.includes(k))) { score += WEIGHTS.occasion; reasons.push('gelegenheidsgerecht'); }

    if (weather && WEATHER_CATS[weather] && WEATHER_CATS[weather].includes(i.category)) { score += WEIGHTS.weather; reasons.push('past bij het weer'); }
    if (weather && (WEATHER_KEYWORDS[weather] || []).some((k) => name.includes(k))) { score += WEIGHTS.weather; }

    if (season && SEASON_CATS[season] && SEASON_CATS[season].includes(i.category)) { score += WEIGHTS.season; reasons.push('seizoengericht'); }

    if (meatPref && CATEGORY_MAP[meatPref] && CATEGORY_MAP[meatPref].includes(i.category)) { score += WEIGHTS.categoryMatch; reasons.push('past bij uw vleesvoorkeur'); }

    if (i.is_popular) { score += WEIGHTS.popularity; reasons.push('populair bij onze gasten'); }
    if (i.is_new) { score += WEIGHTS.newness; reasons.push('nieuw op de kaart'); }

    if (preferences.budget && i.price) {
      const ratio = i.price / preferences.budget;
      if (ratio > 0.85) { score += WEIGHTS.budget * Math.max(0, 1 - Math.abs(1 - ratio)); }
    }

    if (preferences.partySize === 2 && /chateaubriand|côte|os|2p|voor 2/.test(`${name} ${desc}`)) { score += WEIGHTS.party; reasons.push('ideaal voor twee'); }

    return { item: i, score: Math.round(score * 100) / 100, reasons: [...new Set(reasons)] };
  });

  scored.sort((a, b) => b.score - a.score);

  // --- Diversity pass: avoid the top-N being all one category ---
  const result = [];
  const usedCats = {};
  for (const s of scored) {
    if (result.length >= limit) break;
    if (usedCats[s.item.category]) continue;
    usedCats[s.item.category] = true;
    result.push(s);
  }
  if (result.length < limit) {
    for (const s of scored) {
      if (result.length >= limit) break;
      if (!result.includes(s)) result.push(s);
    }
  }

  return result.slice(0, limit).map((s) => ({
    item_name: s.item.item_name,
    category: s.item.category,
    price: s.item.price,
    pairing: s.item.pairing,
    is_popular: s.item.is_popular,
    is_new: s.item.is_new,
    score: s.score,
    reasons: s.reasons,
  }));
}

export function suggestLocation(req) {
  const { partySize, occasion, weather, sundayLunch } = req || {};
  const scores = { hasselt: 0, borgloon: 0, 'heusden-zolder': 0 };
  if (occasion === 'romantic') scores.borgloon += 3;
  if (occasion === 'family' || (partySize && partySize >= 4 && partySize <= 8)) scores['heusden-zolder'] += 3;
  if (occasion === 'business') scores.hasselt += 3;
  if (weather === 'warm') scores['heusden-zolder'] += 1;
  if (sundayLunch) { scores.borgloon += 2; scores['heusden-zolder'] += 2; }
  if (partySize && partySize >= 20) { scores.borgloon += 2; scores['heusden-zolder'] += 2; }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return { location: best[0], score: best[1], scores };
}