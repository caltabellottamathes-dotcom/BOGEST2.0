import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const SPACES_DATA = {
  nl: {
    hasselt: {
      title: 'Restaurant en Ruimtes',
      location: 'Bogèst Hasselt',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Karakteristiek met de stierenkop en open haard.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Keuken / Tomahawk', capacity: 14, desc: 'De open keuken — ideaal voor een exclusieve vleesbeleving.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'De Living', capacity: 45, desc: 'Vernieuwd met authentieke elementen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'Het Terras', capacity: 50, desc: 'Buitenterras met duurzame materialen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ]
    },
    borgloon: {
      title: 'Restaurant en Ruimtes',
      location: 'Bogèst Borgloon',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Ideaal voor aperitieven met vrienden.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'De Living', capacity: 44, desc: 'Centraal in het restaurant, erg gezellig voor een grotere groep.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
        { name: 'De Toog', capacity: 25, desc: 'Kleinere gezellige ruimte aansluitend aan de keuken.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'De Koelcel', capacity: 42, desc: 'Unieke ruimte met doorkijkraam op het vlees.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'Het Terras', capacity: 60, desc: 'Zomers terras met beweegbaar dak.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ]
    },
    'heusden-zolder': {
      title: 'Restaurant en Ruimtes',
      location: 'Bogèst Heusden-Zolder',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Warm ingericht restaurant met authentieke sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'Het Terras', capacity: 40, desc: 'Ruim terras met aangename sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ]
    }
  },
  fr: {
    hasselt: {
      title: 'Restaurant et Espaces',
      location: 'Bogèst Hasselt',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Caractéristique avec la tête de taureau et la cheminée ouverte.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Cuisine Ouverte / Tomahawk', capacity: 14, desc: 'La cuisine ouverte — idéale pour une expérience viande exclusive.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'Le Living', capacity: 45, desc: 'Rénové avec des éléments authentiques.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'La Terrasse', capacity: 50, desc: 'Terrasse extérieure avec matériaux durables.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ]
    },
    borgloon: {
      title: 'Restaurant et Espaces',
      location: 'Bogèst Borgloon',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Idéal pour les apéritifs entre amis.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'Le Living', capacity: 44, desc: 'Au cœur du restaurant, très convivial pour un grand groupe.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
        { name: 'Le Comptoir', capacity: 25, desc: 'Petit espace convivial attenant à la cuisine.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'La Cave Réfrigérée', capacity: 42, desc: 'Espace unique avec vue sur la viande.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'La Terrasse', capacity: 60, desc: 'Terrasse estivale avec toit mobile.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ]
    },
    'heusden-zolder': {
      title: 'Restaurant et Espaces',
      location: 'Bogèst Heusden-Zolder',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Restaurant chaleureusement décoré avec une ambiance authentique.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'La Terrasse', capacity: 40, desc: 'Grande terrasse avec une ambiance agréable.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ]
    }
  },
  en: {
    hasselt: {
      title: 'Restaurant and Spaces',
      location: 'Bogèst Hasselt',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: 'Characterful with the bull\'s head and open fireplace.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Kitchen / Tomahawk', capacity: 14, desc: 'The open kitchen — ideal for an exclusive meat experience.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'The Living Room', capacity: 45, desc: 'Renovated with authentic elements.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'The Terrace', capacity: 50, desc: 'Outdoor terrace with sustainable materials.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ]
    },
    borgloon: {
      title: 'Restaurant and Spaces',
      location: 'Bogèst Borgloon',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: 'Ideal for aperitifs with friends.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'The Living Room', capacity: 44, desc: 'Central in the restaurant, very cosy for a larger group.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
        { name: 'The Counter', capacity: 25, desc: 'Smaller cosy space adjoining the kitchen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'The Cold Room', capacity: 42, desc: 'Unique space with a view through to the meat.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'The Terrace', capacity: 60, desc: 'Summer terrace with a movable roof.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ]
    },
    'heusden-zolder': {
      title: 'Restaurant and Spaces',
      location: 'Bogèst Heusden-Zolder',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Warmly decorated restaurant with authentic atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'The Terrace', capacity: 40, desc: 'Spacious terrace with a pleasant atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ]
    }
  }
};

const NOT_FOUND = { nl: 'Restaurant niet gevonden', fr: 'Restaurant introuvable', en: 'Restaurant not found' };

export default function RestaurantSpaces() {
  const { location } = useParams();
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const data = SPACES_DATA[lang]?.[location];

  if (!data) return <div className="p-6 text-center">{NOT_FOUND[lang] || NOT_FOUND.en}</div>;

  return (
    <div className="w-full">
      <section className="relative w-full pt-32 md:pt-40 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="px-6 md:px-10 lg:px-16">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">{data.location}</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">{data.title}</h1>
        </div>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {data.spaces.map((space, i) => (
            <SectionReveal key={space.name} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="h-48 overflow-hidden">
                  <img src={siteImg('space.' + location + '.' + i) || space.image} data-bb-key={`space.${location}.${i}`} data-bb-label={space.name} alt={space.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-lg font-semibold text-foreground">{space.name}</h3>
                    <span className="inline-flex items-center gap-1 font-body text-xs text-primary">
                      <Users className="w-3 h-3" /> {t('grp_max')} {space.capacity}p
                    </span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{space.desc}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}