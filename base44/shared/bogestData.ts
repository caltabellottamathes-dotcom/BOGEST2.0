// Bogèst static knowledge data (locations, hours, policies) shared across
// knowledge / business / reservation tools. Menu items live in the
// MenuKnowledge entity; this module holds the stable structural data.

export const LOCATIONS = {
  hasselt: {
    name: 'Bogèst Hasselt',
    address: 'Luikersteenweg 516, 3501 Wimmertingen',
    phone: '011 41 54 28',
    email: 'info@bogest-hasselt.be',
    hours: { mon: null, tue: '17:00-22:00', wed: '17:00-22:00', thu: null, fri: '17:00-22:00', sat: '17:00-22:00', sun: '17:00-22:00' },
    sundayLunch: false,
    zenchefId: '368482',
    zenchefLink: 'https://bookings.zenchef.com/results?rid=368482&pid=1001',
    atmosphere: 'Klassiek, centraal gelegen, goed bereikbaar vanuit Hasselt centrum.',
    groupMin: 12,
    parking: 'Tegenover bij de kerk.',
  },
  borgloon: {
    name: 'Bogèst Borgloon',
    address: 'Graathempoort 33, 3840 Borgloon',
    phone: '012 22 61 20',
    email: 'info@bogest-borgloon.be',
    hours: { mon: null, tue: null, wed: '17:00-22:00', thu: '17:00-22:00', fri: '17:00-22:00', sat: '17:00-22:00', sun: '11:30-14:00,17:00-22:00' },
    sundayLunch: true,
    zenchefId: '368313',
    zenchefLink: 'https://bookings.zenchef.com/results?rid=368313&pid=1001',
    atmosphere: 'Charmant, landelijk, intiem — ideaal voor speciale gelegenheden en romantische diners.',
    groupMin: 0,
    parking: 'Ruime parking naast restaurant.',
  },
  'heusden-zolder': {
    name: 'Bogèst Heusden-Zolder',
    address: 'Stationsstraat 67, 3550 Heusden-Zolder',
    phone: '011 18 21 20',
    email: 'info@bogest-heusdenzolder.be',
    hours: { mon: null, tue: null, wed: '17:00-22:00', thu: '17:00-22:00', fri: '17:00-22:00', sat: '17:00-22:00', sun: '11:30-14:00,17:00-22:00' },
    sundayLunch: true,
    zenchefId: '368311',
    zenchefLink: 'https://bookings.zenchef.com/results?rid=368311&pid=1001',
    atmosphere: 'Modern, gezinsvriendelijk, ruim — populair bij families met kinderen.',
    groupMin: 0,
    parking: 'Achter restaurant en aan station.',
  },
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function parseRanges(hoursStr) {
  if (!hoursStr) return [];
  return hoursStr.split(',').map((range) => {
    const [s, e] = range.split('-');
    const [sh, sm] = (s || '').trim().split(':').map(Number);
    const [eh, em] = (e || '').trim().split(':').map(Number);
    return { start: sh * 60 + (sm || 0), end: eh * 60 + (em || 0) };
  });
}

export function isOpenNow(location, date = new Date()) {
  const loc = LOCATIONS[location];
  if (!loc) return false;
  const dayKey = DAY_KEYS[date.getDay()];
  const ranges = parseRanges(loc.hours[dayKey]);
  if (ranges.length === 0) return false;
  const now = date.getHours() * 60 + date.getMinutes();
  return ranges.some((r) => now >= r.start && now <= r.end);
}

export function nextOpenDay(location, date = new Date()) {
  const loc = LOCATIONS[location];
  if (!loc) return null;
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(d.getDate() + i);
    const dayKey = DAY_KEYS[d.getDay()];
    const ranges = parseRanges(loc.hours[dayKey]);
    if (ranges.length > 0) {
      return {
        date: d.toISOString().slice(0, 10),
        dayKey,
        firstOpen: ranges[0].start,
        label: d.toLocaleDateString('nl-BE', { weekday: 'long' }),
      };
    }
  }
  return null;
}

export function hoursSummary(location) {
  const loc = LOCATIONS[location];
  if (!loc) return null;
  const labels = { mon: 'Ma', tue: 'Di', wed: 'Wo', thu: 'Do', fri: 'Vr', sat: 'Za', sun: 'Zo' };
  const lines = [];
  for (const k of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
    lines.push(`${labels[k]}: ${loc.hours[k] || 'gesloten'}`);
  }
  return { summary: lines.join(' | '), sundayLunch: loc.sundayLunch };
}

export const POLICIES = {
  allergens: 'Voor allergieën of dieetwensen: informeer altijd de ober bij aankomst. De keukinploeg bevestigt wat veilig is — de digitale gastheer kan nooit een garantie geven.',
  reservations: 'Reserveren gaat via de website, telefoon of ZenChef. Speciale wensen altijd vermelden. Weekenden vullen snel — bij geen online beschikbaarheid belt ge best de vestiging.',
  groups: 'Groepen vanaf 20 personen: neem minstens 3 dagen op voorhand contact met de vestiging. Hasselt heeft op vrijdag/zaterdag geen groepsformuleer — dan à la carte voor groepen of een andere dag. Onder de 12 (Hasselt) is de formuleer mogelijk niet van toepassing.',
  giftcards: 'Cadeaubonnen zijn beschikbaar digitaal, fysiek of in de vestiging. Te bestellen via de website (/gift-cards).',
  takeaway: 'Online bestellen, afhaal 17:30–21:30. De formuleer (voorgerecht + dessert inbegrepen) geldt NIET voor takeaway.',
  complaints: 'Bij een slechte ervaring of klacht routeert de gastheer u direct door naar de vestiging. Borgloon: 012 21 06 90 / info@bogest-borgloon.be. Hasselt: 011 41 54 28 / info@bogest-hasselt.be. Heusden-Zolder: 011 18 21 20 / info@bogest-heusdenzolder.be.',
};

export const FAQ = {
  parking: { q: 'Parkeren', a: 'Hasselt: tegenover bij de kerk. Borgloon: ruime parking naast restaurant. Heusden-Zolder: achter restaurant en aan station.' },
  kids: { q: 'Kinderen', a: 'Kinderstoelen op aanvraag. Kinderen kunnen hun ijs versieren. Heusden-Zolder is het meest gezinsvriendelijk en ruimst.' },
  pets: { q: 'Huisdieren', a: 'Welkom op het terras.' },
  dresscode: { q: 'Dresscode', a: 'Geen — smart casual.' },
  formula: { q: 'Formuleer', a: 'Bij elk hoofdgerecht zijn een voorgerecht én een dessert inbegrepen — ge betaalt alleen het hoofdgerecht. Geldt niet voor takeaway.' },
};