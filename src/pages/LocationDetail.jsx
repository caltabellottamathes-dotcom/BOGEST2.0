import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Users, Clock, Car, ArrowUpRight, Sparkles } from 'lucide-react';
import RestaurantPanel from '@/components/RestaurantPanel';
import PanelContent from '@/components/PanelContent';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { getLocations } from '@/lib/data';
import SubPageNav from '@/components/SubPageNav';
import { askHost, spaceQuestion, hostHintLabel } from '@/lib/hostHint';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// ── Restaurant & spaces per location (nl / fr / en) ──────────────────────────
const SPACES = {
  nl: {
    hasselt: {
      title: 'Restaurant en Ruimtes', location: 'Bogèst Hasselt',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Karakteristiek met de stierenkop en open haard.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Keuken / Tomahawk', capacity: 14, desc: 'De open keuken — ideaal voor een exclusieve vleesbeleving.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'De Living', capacity: 45, desc: 'Vernieuwd met authentieke elementen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OYUUDSFSMKYI/IMG_4186.jpg' },
        { name: 'Het Terras', capacity: 50, desc: 'Buitenterras met duurzame materialen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS5OTC5NE/IMG_4180.jpg' },
      ],
    },
    borgloon: {
      title: 'Restaurant en Ruimtes', location: 'Bogèst Borgloon',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Ideaal voor aperitieven met vrienden.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'De Living', capacity: 44, desc: 'Centraal in het restaurant, erg gezellig voor een grotere groep.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MYZEZKY/living2.jpeg' },
        { name: 'De Toog', capacity: 25, desc: 'Kleinere gezellige ruimte aansluitend aan de keuken.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'De Koelcel', capacity: 42, desc: 'Unieke ruimte met doorkijkraam op het vlees.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'Het Terras', capacity: 60, desc: 'Zomers terras met beweegbaar dak.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ],
    },
    'heusden-zolder': {
      title: 'Restaurant en Ruimtes', location: 'Bogèst Heusden-Zolder',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Warm ingericht restaurant met authentieke sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'Het Terras', capacity: 40, desc: 'Ruim terras met aangename sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ],
    },
  },
  fr: {
    hasselt: {
      title: 'Restaurant et Espaces', location: 'Bogèst Hasselt',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Caractéristique avec la tête de taureau et la cheminée ouverte.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Cuisine Ouverte / Tomahawk', capacity: 14, desc: 'La cuisine ouverte — idéale pour une expérience viande exclusive.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'Le Living', capacity: 45, desc: 'Rénové avec des éléments authentiques.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OYUUDSFSMKYI/IMG_4186.jpg' },
        { name: 'La Terrasse', capacity: 50, desc: 'Terrasse extérieure avec matériaux durables.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS5OTC5NE/IMG_4180.jpg' },
      ],
    },
    borgloon: {
      title: 'Restaurant et Espaces', location: 'Bogèst Borgloon',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Idéal pour les apéritifs entre amis.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'Le Living', capacity: 44, desc: 'Au cœur du restaurant, très convivial pour un grand groupe.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MYZEZKY/living2.jpeg' },
        { name: 'Le Comptoir', capacity: 25, desc: 'Petit espace convivial attenant à la cuisine.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'La Cave Réfrigérée', capacity: 42, desc: 'Espace unique avec vue sur la viande.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'La Terrasse', capacity: 60, desc: 'Terrasse estivale avec toit mobile.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ],
    },
    'heusden-zolder': {
      title: 'Restaurant et Espaces', location: 'Bogèst Heusden-Zolder',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Restaurant chaleureusement décoré avec une ambiance authentique.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'La Terrasse', capacity: 40, desc: 'Grande terrasse avec une ambiance agréable.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ],
    },
  },
  en: {
    hasselt: {
      title: 'Restaurant and Spaces', location: 'Bogèst Hasselt',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: "Characterful with the bull's head and open fireplace.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Kitchen / Tomahawk', capacity: 14, desc: 'The open kitchen — ideal for an exclusive meat experience.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'The Living Room', capacity: 45, desc: 'Renovated with authentic elements.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OYUUDSFSMKYI/IMG_4186.jpg' },
        { name: 'The Terrace', capacity: 50, desc: 'Outdoor terrace with sustainable materials.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS5OTC5NE/IMG_4180.jpg' },
      ],
    },
    borgloon: {
      title: 'Restaurant and Spaces', location: 'Bogèst Borgloon',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: 'Ideal for aperitifs with friends.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'The Living Room', capacity: 44, desc: 'Central in the restaurant, very cosy for a larger group.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MYZEZKY/living2.jpeg' },
        { name: 'The Counter', capacity: 25, desc: 'Smaller cosy space adjoining the kitchen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'The Cold Room', capacity: 42, desc: 'Unique space with a view through to the meat.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'The Terrace', capacity: 60, desc: 'Summer terrace with a movable roof.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ],
    },
    'heusden-zolder': {
      title: 'Restaurant and Spaces', location: 'Bogèst Heusden-Zolder',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Warmly decorated restaurant with authentic atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'The Terrace', capacity: 40, desc: 'Spacious terrace with a pleasant atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ],
    },
  },
};

const STR = {
  nl: {
    spacesIntro: 'Elke ruimte heeft zijn eigen karakter — van de intieme bar tot het ruime terras. Vind de plek die bij uw gezelschap past.',
    aboutExtra: 'Een sfeervolle plek waar ambacht, gastvrijheid en een gulhartige keuken samenkomen. Of u nu komt voor een intiem diner of een feest met een grotere groep, ons team ontvangt u graag.',
    totalCap: 'Totale capaciteit', spacesLabel: 'Ruimtes', openToday: 'Open vandaag', parkingLabel: 'Parking',
    groupsCta: 'Groepen & events', routeCta: 'Route', reserveCta: 'Reserveer een tafel',
    comingSoon: 'Binnenkort geopend', comingSoonDesc: 'Onze vierde vestiging is in voorbereiding. We houden u graag op de hoogte.',
  },
  fr: {
    spacesIntro: "Chaque espace a son propre caractère — du bar intimiste à la grande terrasse. Trouvez l'endroit qui convient à votre groupe.",
    aboutExtra: "Un lieu chaleureux où artisanat, hospitalité et cuisine généreuse se rencontrent. Que ce soit pour un dîner intime ou une fête en grand groupe, notre équipe vous accueille avec plaisir.",
    totalCap: 'Capacité totale', spacesLabel: 'Espaces', openToday: "Ouvert aujourd'hui", parkingLabel: 'Parking',
    groupsCta: 'Groupes & events', routeCta: 'Itinéraire', reserveCta: 'Réserver une table',
    comingSoon: 'Bientôt ouvert', comingSoonDesc: "Notre quatrième établissement est en préparation. Nous vous tiendrons informés.",
  },
  en: {
    spacesIntro: 'Each space has its own character — from the intimate bar to the spacious terrace. Find the spot that suits your party.',
    aboutExtra: 'A warm place where craft, hospitality and a generous kitchen come together. Whether for an intimate dinner or a celebration with a larger group, our team welcomes you gladly.',
    totalCap: 'Total capacity', spacesLabel: 'Spaces', openToday: 'Open today', parkingLabel: 'Parking',
    groupsCta: 'Groups & events', routeCta: 'Directions', reserveCta: 'Reserve a table',
    comingSoon: 'Opening soon', comingSoonDesc: 'Our fourth location is in preparation. We will keep you posted.',
  },
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70">{label}</span>
      </div>
      <p className="font-heading text-2xl md:text-3xl font-bold text-primary leading-none">{value}</p>
    </div>
  );
}

const CLOSED_KEYWORDS = ['gesloten', 'fermé', 'closed'];
function parseHM(s) {
  const m = s.trim().match(/(\d{1,2}):(\d{2})/);
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null;
}
function getTodayHoursEntry(hours, lang, now) {
  const locale = lang === 'fr' ? 'fr-BE' : lang === 'en' ? 'en-GB' : 'nl-BE';
  const todayName = now.toLocaleDateString(locale, { weekday: 'long' }).toLowerCase();
  return hours.find((h) => h.day.toLowerCase() === todayName);
}
function isOpenNow(hours, lang, now) {
  const entry = getTodayHoursEntry(hours, lang, now);
  if (!entry) return false;
  const t = entry.time.toLowerCase();
  if (CLOSED_KEYWORDS.some((w) => t.includes(w))) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const ranges = entry.time.split('/').map((s) => s.trim());
  for (const r of ranges) {
    const parts = r.split(/[–—-]/).map((s) => s.trim());
    if (parts.length === 2) {
      const start = parseHM(parts[0]);
      const end = parseHM(parts[1]);
      if (start != null && end != null && nowMin >= start && nowMin < end) return true;
    }
  }
  return false;
}
function LiveOpenCard({ hours, lang, L }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const open = isOpenNow(hours, lang, now);
  const entry = getTodayHoursEntry(hours, lang, now);
  const status = open
    ? (lang === 'fr' ? 'Ouvert' : lang === 'en' ? 'Open' : 'Open')
    : (lang === 'fr' ? 'Fermé' : lang === 'en' ? 'Closed' : 'Gesloten');
  return (
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-2.5">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70">{L.openToday}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full ${open ? 'bg-primary animate-pulse' : 'bg-muted-foreground/45'}`} />
        <p className={`font-heading text-2xl md:text-3xl font-bold leading-none ${open ? 'text-primary' : 'text-muted-foreground'}`}>{status}</p>
      </div>
      {entry && <p className="font-body text-xs text-muted-foreground mt-2 tracking-wide">{entry.time}</p>}
    </div>
  );
}

export default function LocationDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const locations = getLocations(lang);
  const loc = locations.find(l => l.slug === slug);
  const [showRestaurantPanel, setShowRestaurantPanel] = useState(false);

  useEffect(() => {
    const openSpaces = () => setShowRestaurantPanel(true);
    const closePanel = () => setShowRestaurantPanel(false);
    window.addEventListener('bogest:open-spaces', openSpaces);
    window.addEventListener('bogest:close-panel', closePanel);
    return () => {
      window.removeEventListener('bogest:open-spaces', openSpaces);
      window.removeEventListener('bogest:close-panel', closePanel);
    };
  }, []);

  if (!loc) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">{t('loc_not_found')}</h1>
          <Link to="/locations" className="font-body text-sm text-primary hover:underline">{t('loc_back')}</Link>
        </div>
      </div>
    );
  }

  const L = STR[lang] || STR.nl;
  const data = SPACES[lang]?.[slug] || SPACES.nl[slug];
  const spaces = data?.spaces || [];
  const totalCapacity = spaces.reduce((s, sp) => s + (sp.capacity || 0), 0);

  // Coming-soon location (e.g. Lommel)
  if (loc.active === false) {
    return (
      <div className="w-full">
        <SubPageNav backTo="/locations" backLabel={t('nav_locations')} nextTo="/locations" nextLabel={t('nav_locations')} />
        <section className="relative w-full pt-32 md:pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="w-full px-6 md:px-10 lg:px-16">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">{t('nav_locations')}</span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground">{loc.name}</h1>
            <p className="font-body text-base text-muted-foreground mt-2">{loc.city}, {loc.region}</p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-primary/30 bg-primary/5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-body text-sm text-primary font-medium">{L.comingSoon}</span>
            </div>
            <p className="font-body text-base text-muted-foreground mt-6 max-w-xl leading-relaxed">{L.comingSoonDesc}</p>
          </div>
        </section>
      </div>
    );
  }

  // Next location for sub-page navigation (order: hasselt → borgloon → heusden-zolder → lommel → /locations)
  const allLocs = getLocations(lang);
  const idxLoc = allLocs.findIndex((l) => l.slug === slug);
  const nextLoc = allLocs[idxLoc + 1];
  const nextTo = nextLoc ? `/locations/${nextLoc.slug}` : '/locations';
  const nextLabel = nextLoc ? nextLoc.city : t('nav_locations');

  // Derive highlight chips from the actual spaces
  const highlights = [];
  if (spaces.some(s => /terras|terrasse|terrace/i.test(s.name))) highlights.push(lang === 'fr' ? 'Terrasse' : lang === 'en' ? 'Terrace' : 'Terras');
  if (spaces.some(s => /bar/i.test(s.name))) highlights.push('Bar');
  if (spaces.some(s => /open keuken|open kitchen|cuisine ouverte/i.test(s.name))) highlights.push(lang === 'fr' ? 'Cuisine ouverte' : lang === 'en' ? 'Open kitchen' : 'Open keuken');
  if (spaces.some(s => /koelcel|cave réfrigérée|cold room/i.test(s.name))) highlights.push(lang === 'fr' ? 'Cave réfrigérée' : lang === 'en' ? 'Cold room' : 'Koelcel');
  if (spaces.some(s => /living/i.test(s.name))) highlights.push(lang === 'fr' ? 'Living' : lang === 'en' ? 'Living room' : 'Living');

  return (
    <div className="w-full">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[46vh] min-h-[360px] w-full">
          <img src={siteImg('location.' + slug) || loc.image} alt={loc.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 3%, hsl(var(--background) / 0.32) 45%, rgba(0,0,0,0.5) 100%)' }} />
          {/* Ghosted city name bleeding off the right edge */}
          <span aria-hidden className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 font-heading italic font-bold text-white/[0.06] select-none pointer-events-none leading-none" style={{ fontSize: 'clamp(8rem, 26vw, 20rem)' }}>{loc.city}</span>
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-28 md:pb-32">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 block">{t('nav_locations')} · {loc.region}</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">{loc.name}<span className="text-primary">.</span></h1>
            <p className="font-body text-sm md:text-base text-foreground/80 mt-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {loc.address}
            </p>
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {highlights.map(h => (
                  <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs text-foreground"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}>
                    <Sparkles className="w-3 h-3 text-primary" /> {h}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <PanelContent>
      <SubPageNav backTo="/locations" backLabel={t('nav_locations')} nextTo={nextTo} nextLabel={nextLabel} />
      {/* ── Quick stats ──────────────────────────────────────────────────── */}
      <section className="w-full px-6 md:px-10 lg:px-16 pt-8 md:pt-10 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-0 md:divide-x md:divide-white/10">
          <StatCard icon={Users} label={L.totalCap} value={`${totalCapacity}p`} />
          <StatCard icon={Sparkles} label={L.spacesLabel} value={spaces.length} />
          <LiveOpenCard hours={loc.hours} lang={lang} L={L} />
          <StatCard icon={Car} label={L.parkingLabel} value={loc.parking ? (lang === 'fr' ? 'Oui' : lang === 'en' ? 'Yes' : 'Ja') : '—'} />
        </div>
      </section>

      {/* ── Restaurant en ruimtes ────────────────────────────────────────── */}
      {spaces.length > 0 && (
        <section id="spaces" className="relative w-full px-6 md:px-10 lg:px-16 py-14 md:py-20 overflow-hidden">
          <img src={BULL_MARK} alt="" aria-hidden draggable={false}
            className="absolute pointer-events-none select-none hidden md:block"
            style={{ height: '120%', width: 'auto', right: '-6%', bottom: '-46%', opacity: 0.07, filter: 'grayscale(1) brightness(2.4)' }} />
          <SectionReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-10 bg-primary" />
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('loc_spaces')}</span>
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground">{data.title}<span className="text-primary">.</span></h2>
                <p className="font-body text-sm text-muted-foreground mt-4 max-w-xl leading-relaxed">{L.spacesIntro}</p>
              </div>
              <div className="flex items-center gap-2 font-body text-sm text-muted-foreground whitespace-nowrap">
                <Users className="w-4 h-4 text-primary" />
                {spaces.length} {L.spacesLabel.toLowerCase()} · {lang === 'fr' ? "jusqu'à" : lang === 'en' ? 'up to' : 'tot'} {totalCapacity} {lang === 'en' ? 'guests' : 'personen'}
              </div>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
            {spaces.map((space, i) => {
              const span = i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5';
              return (
                <SectionReveal key={space.name} delay={i * 0.06} className={span}>
                  <button
                    type="button"
                    onClick={() => askHost(spaceQuestion(lang, space.name, loc.city))}
                    className="group relative overflow-hidden rounded-2xl h-full min-h-[16rem] md:min-h-[20rem] w-full text-left cursor-pointer"
                    style={{ boxShadow: '0 18px 48px rgba(0,0,0,0.4)' }}
                  >
                    <div className="absolute inset-0">
                      <img src={siteImg('space.' + slug + '.' + i) || space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    </div>
                    <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md font-body text-[9px] tracking-[0.25em] uppercase text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {hostHintLabel(lang)}
                    </span>
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <h3 className="font-heading text-xl md:text-2xl font-bold text-white">{space.name}</h3>
                        <span className="inline-flex items-center gap-1 font-body text-xs text-primary whitespace-nowrap px-2.5 py-1 rounded-full bg-black/35 border border-primary/30">
                          <Users className="w-3 h-3" /> {space.capacity}p
                        </span>
                      </div>
                      <p className="font-body text-sm text-white/75 leading-relaxed max-w-xs">{space.desc}</p>
                    </div>
                  </button>
                </SectionReveal>
              );
            })}
          </div>

          {loc.zenchefId && (
            <div className="mt-10 flex flex-wrap gap-3 relative z-10">
              <Link to={`/reserve?loc=${loc.slug}`}
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
                {L.reserveCta} <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link to="/groups"
                className="inline-flex items-center gap-2 px-7 py-3 border border-border text-foreground font-body text-xs tracking-widest uppercase rounded-full hover:border-primary hover:text-primary transition-all duration-500">
                {L.groupsCta} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ── About + practical info ───────────────────────────────────────── */}
      <section className="relative w-full px-6 md:px-10 lg:px-16 py-14 md:py-20 border-t border-border overflow-hidden">
        <span aria-hidden className="absolute -bottom-10 right-2 md:right-10 font-heading italic font-bold text-foreground/[0.04] select-none pointer-events-none leading-none" style={{ fontSize: 'clamp(7rem, 20vw, 16rem)' }}>{loc.city}</span>
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionReveal>
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('loc_about')} {loc.city}</span>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-5 leading-tight">{loc.name}<span className="text-primary">.</span></h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">{t('loc_about_desc').replace('{city}', loc.city)}</p>
              <p className="font-body text-base text-muted-foreground leading-relaxed mt-4">{L.aboutExtra}</p>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <SectionReveal id="openingsuren" delay={0.05}>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> {t('loc_hours')}
                </h3>
                <div className="space-y-0 rounded-xl border border-border overflow-hidden bg-card/40">
                  {loc.hours.map((h, i) => (
                    <div key={h.day} className={`flex justify-between font-body text-sm px-4 py-2.5 ${i % 2 === 0 ? 'bg-card/30' : ''} border-b border-border/40 last:border-0`}>
                      <span className="text-foreground">{h.day}</span>
                      <span className={h.time === 'Gesloten' || h.time === 'Fermé' || h.time === 'Closed' || h.time.includes('beschikbaar') ? 'text-muted-foreground' : 'text-primary font-medium'}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal id="parking" delay={0.1}>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" /> {t('loc_parking')}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{loc.parking || '—'}</p>
                <h3 className="font-heading text-lg font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> {lang === 'fr' ? 'Adresse' : lang === 'en' ? 'Address' : 'Adres'}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{loc.address}</p>
              </SectionReveal>
            </div>
          </div>

          <SectionReveal id="contact" direction="right" delay={0.1} className="lg:col-span-5 h-fit">
            <div className="bg-card border border-border rounded-2xl p-7 space-y-5 sticky top-24">
              <h3 className="font-heading text-lg font-semibold text-foreground">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-body text-sm text-muted-foreground">{loc.address}</span>
                </div>
                {loc.phone && (
                  <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-primary transition-colors">{loc.phone}</span>
                  </a>
                )}
                {loc.email && (
                  <a href={`mailto:${loc.email}`} className="flex items-center gap-3 group">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-primary transition-colors break-all">{loc.email}</span>
                  </a>
                )}
              </div>
              <div className="pt-4 border-t border-border flex flex-col gap-2.5">
                {loc.zenchefId && (
                  <Link to={`/reserve?loc=${loc.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-300">
                    {t('btn_reserve')} <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
                {loc.mapsUrl && (
                  <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border text-foreground font-body text-xs tracking-widest uppercase rounded-full hover:border-primary hover:text-primary transition-all duration-300">
                    {L.routeCta} <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      </PanelContent>

      {/* Agent-triggered overlay (kept for the digital host / ElevenLabs) */}
      {data && (
        <RestaurantPanel
          isOpen={showRestaurantPanel}
          onClose={() => setShowRestaurantPanel(false)}
          {...data}
        />
      )}
    </div>
  );
}