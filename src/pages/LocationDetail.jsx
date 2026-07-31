import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Users, Clock, Car, ArrowUpRight, Sparkles } from 'lucide-react';
import RestaurantPanel from '@/components/RestaurantPanel';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { getLocations } from '@/lib/data';

// ── Restaurant & spaces per location (nl / fr / en) ──────────────────────────
const SPACES = {
  nl: {
    hasselt: {
      title: 'Restaurant en Ruimtes', location: 'Bogèst Hasselt',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Karakteristiek met de stierenkop en open haard.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Keuken / Tomahawk', capacity: 14, desc: 'De open keuken — ideaal voor een exclusieve vleesbeleving.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'De Living', capacity: 45, desc: 'Vernieuwd met authentieke elementen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'Het Terras', capacity: 50, desc: 'Buitenterras met duurzame materialen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ],
    },
    borgloon: {
      title: 'Restaurant en Ruimtes', location: 'Bogèst Borgloon',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Ideaal voor aperitieven met vrienden.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'De Living', capacity: 44, desc: 'Centraal in het restaurant, erg gezellig voor een grotere groep.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
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
        { name: 'Le Living', capacity: 45, desc: 'Rénové avec des éléments authentiques.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'La Terrasse', capacity: 50, desc: 'Terrasse extérieure avec matériaux durables.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ],
    },
    borgloon: {
      title: 'Restaurant et Espaces', location: 'Bogèst Borgloon',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Idéal pour les apéritifs entre amis.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'Le Living', capacity: 44, desc: 'Au cœur du restaurant, très convivial pour un grand groupe.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
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
        { name: 'The Bar', capacity: 40, desc: 'Characterful with the bull\'s head and open fireplace.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Kitchen / Tomahawk', capacity: 14, desc: 'The open kitchen — ideal for an exclusive meat experience.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'The Living Room', capacity: 45, desc: 'Renovated with authentic elements.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'The Terrace', capacity: 50, desc: 'Outdoor terrace with sustainable materials.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ],
    },
    borgloon: {
      title: 'Restaurant and Spaces', location: 'Bogèst Borgloon',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: 'Ideal for aperitifs with friends.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'The Living Room', capacity: 44, desc: 'Central in the restaurant, very cosy for a larger group.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
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
    totalCap: 'Capacité totale', spacesLabel: 'Espaces', openToday: 'Ouvert aujourd’hui', parkingLabel: 'Parking',
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
    <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md p-4">
      <div className="flex items-center gap-2 text-primary mb-1.5">
        <Icon className="w-4 h-4" />
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      </div>
      <p className="font-heading text-lg font-semibold text-foreground leading-tight">{value}</p>
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

  // Today's hours
  const locale = lang === 'fr' ? 'fr-BE' : lang === 'en' ? 'en-GB' : 'nl-BE';
  const todayName = new Date().toLocaleDateString(locale, { weekday: 'long' }).toLowerCase();
  const todayHour = loc.hours.find(h => h.day.toLowerCase() === todayName);
  const openToday = todayHour ? todayHour.time : '—';

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
        <div className="relative h-[58vh] min-h-[380px] w-full">
          <img src={siteImg('location.' + slug) || loc.image} alt={loc.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 4%, hsl(var(--background) / 0.35) 42%, rgba(0,0,0,0.45) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-10 md:pb-14">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 block">{t('nav_locations')} · {loc.region}</span>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">{loc.name}</h1>
            <p className="font-body text-sm md:text-base text-muted-foreground mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {loc.address}
            </p>
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {highlights.map(h => (
                  <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs text-foreground"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                    <Sparkles className="w-3 h-3 text-primary" /> {h}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick stats ───────────────────────────────────────────────────── */}
      <section className="w-full px-6 md:px-10 lg:px-16 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users} label={L.totalCap} value={`${totalCapacity}p`} />
          <StatCard icon={Sparkles} label={L.spacesLabel} value={spaces.length} />
          <StatCard icon={Clock} label={L.openToday} value={openToday} />
          <StatCard icon={Car} label={L.parkingLabel} value={loc.parking ? (lang === 'fr' ? 'Oui' : lang === 'en' ? 'Yes' : 'Ja') : '—'} />
        </div>
      </section>

      {/* ── Restaurant en ruimtes (prominent, top) ───────────────────────── */}
      {spaces.length > 0 && (
        <section id="spaces" className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <SectionReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2 block">{t('loc_spaces')}</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{data.title}</h2>
                <p className="font-body text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">{L.spacesIntro}</p>
              </div>
              <div className="flex items-center gap-2 font-body text-sm text-muted-foreground whitespace-nowrap">
                <Users className="w-4 h-4 text-primary" />
                {spaces.length} {L.spacesLabel.toLowerCase()} · {lang === 'fr' ? 'jusqu’à' : lang === 'en' ? 'up to' : 'tot'} {totalCapacity} {lang === 'en' ? 'guests' : 'personen'}
              </div>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {spaces.map((space, i) => (
              <SectionReveal key={space.name} delay={i * 0.07}>
                <div className="group rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 bg-card h-full flex flex-col">
                  <div className="h-44 overflow-hidden">
                    <img src={siteImg('space.' + slug + '.' + i) || space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{space.name}</h3>
                      <span className="inline-flex items-center gap-1 font-body text-xs text-primary whitespace-nowrap">
                        <Users className="w-3 h-3" /> {space.capacity}p
                      </span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{space.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {loc.zenchefId && (
            <div className="mt-8 flex flex-wrap gap-3">
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

      {/* ── About + practical info ────────────────────────────────────────── */}
      <section className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionReveal>
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2 block">{t('loc_about')} {loc.city}</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{loc.name}</h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">{t('loc_about_desc').replace('{city}', loc.city)}</p>
              <p className="font-body text-base text-muted-foreground leading-relaxed mt-4">{L.aboutExtra}</p>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <SectionReveal id="openingsuren" delay={0.05}>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> {t('loc_hours')}
                </h3>
                <div className="space-y-0 rounded-xl border border-border overflow-hidden">
                  {loc.hours.map((h, i) => (
                    <div key={h.day} className={`flex justify-between font-body text-sm px-4 py-2.5 ${i % 2 === 0 ? 'bg-card/40' : ''} border-b border-border/40 last:border-0`}>
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

          <SectionReveal id="contact" direction="right" delay={0.1} className="h-fit">
            <div className="bg-card border border-border rounded-xl p-7 space-y-5 sticky top-24">
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