import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, MapPin, Users, Star, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import PanelHero from '@/components/PanelHero';
import HostHint from '@/components/HostHint';
import { hostQuestion, hostHintLabel } from '@/lib/hostHint';

const LOCATIONS_I18N = {
  nl: [
  {
    id: 'borgloon', name: 'Bogèst Borgloon', city: 'Borgloon', address: 'Graethempoort 33, 3840 Borgloon', phone: '012 22 61 20', email: 'info@bogest-borgloon.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
    tagline: 'Authentieke hoeve met vijf unieke ruimtes',
    highlights: ['Gratis parking', 'Vanaf 20p aparte ruimte', 'Betaling via factuur', 'Show-elementen mogelijk'],
    formula: 'Formule vanaf €53 pp — 3-gangen menu incl. wijn, water & koffie',
    spaces: [
      { name: 'De Bar', capacity: 40, desc: 'Ideaal voor aperitieven met vrienden.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
      { name: 'De Living', capacity: 44, desc: 'Centraal in het restaurant, erg gezellig voor een grotere groep.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
      { name: 'De Toog', capacity: 25, desc: 'Kleinere gezellige ruimte aansluitend aan de keuken.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
      { name: 'De Koelcel', capacity: 42, desc: 'Unieke ruimte met doorkijkraam op het vlees.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
      { name: 'Het Terras', capacity: 60, desc: 'Zomers terras met beweegbaar dak.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
    ],
  },
  {
    id: 'hasselt', name: 'Bogèst Hasselt', city: 'Hasselt', address: 'Luikersteenweg 516, 3501 Wimmertingen', phone: '011 41 54 28', email: 'info@bogest-hasselt.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
    tagline: 'Authentieke charme in het hart van Limburg',
    highlights: ['Gratis parking', 'Vanaf 20p aparte ruimte', 'Betaling via factuur', 'Tomahawk & magnum beleving'],
    formula: 'Formule vanaf €55 pp — 3-gangen menu incl. wijn, water & koffie (v.a. 12p, niet op vr/za)',
    spaces: [
      { name: 'De Bar', capacity: 40, desc: 'Karakteristiek met de stierenkop en open haard.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
      { name: 'Open Keuken / Tomahawk', capacity: 14, desc: 'De open keuken — ideaal voor een exclusieve vleesbeleving.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
      { name: 'De Living', capacity: 45, desc: 'Vernieuwd met authentieke elementen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
      { name: 'Het Terras', capacity: 50, desc: 'Buitenterras met duurzame materialen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
    ],
  },
  {
    id: 'heusden-zolder', name: 'Bogèst Heusden-Zolder', city: 'Heusden-Zolder', address: 'Stationsstraat 67, 3550 Heusden-Zolder', phone: '011 18 21 20', email: 'info@bogest-heusdenzolder.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
    tagline: 'Gezellige sfeer aan het station',
    highlights: ['Parking achter restaurant & station', 'Aparte ruimtes op aanvraag', 'Betaling via factuur', 'Volledige à la carte voor groepen'],
    formula: 'Formule vanaf €55 pp — 3-gangen menu incl. wijn, water & koffie (v.a. 12p)',
    spaces: [
      { name: 'Restaurant', capacity: 80, desc: 'Warm ingericht restaurant met authentieke sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      { name: 'Het Terras', capacity: 40, desc: 'Ruim terras met aangename sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
    ],
  },
  { id: 'lommel', name: 'Bogèst Lommel', city: 'Lommel', address: 'Lommel, Limburg', phone: '', email: '', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg', tagline: 'Binnenkort beschikbaar', highlights: ['Nieuwe vestiging', 'Info volgt binnenkort'], formula: '', spaces: [], comingSoon: true },
  ],
  fr: [
  {
    id: 'borgloon', name: 'Bogèst Borgloon', city: 'Borgloon', address: 'Graethempoort 33, 3840 Borgloon', phone: '012 22 61 20', email: 'info@bogest-borgloon.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
    tagline: 'Ferme authentique avec cinq espaces uniques',
    highlights: ['Parking gratuit', 'Espace privé dès 20p', 'Paiement sur facture', 'Éléments de spectacle possibles'],
    formula: 'Formule à partir de €53 pp — menu 3 services incl. vin, eau & café',
    spaces: [
      { name: 'Le Bar', capacity: 40, desc: 'Idéal pour les apéritifs entre amis.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
      { name: 'Le Living', capacity: 44, desc: 'Au cœur du restaurant, très convivial pour un grand groupe.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
      { name: 'Le Comptoir', capacity: 25, desc: 'Petit espace convivial attenant à la cuisine.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
      { name: 'La Cave Réfrigérée', capacity: 42, desc: 'Espace unique avec vue sur la viande.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
      { name: 'La Terrasse', capacity: 60, desc: 'Terrasse estivale avec toit mobile.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
    ],
  },
  {
    id: 'hasselt', name: 'Bogèst Hasselt', city: 'Hasselt', address: 'Luikersteenweg 516, 3501 Wimmertingen', phone: '011 41 54 28', email: 'info@bogest-hasselt.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
    tagline: 'Charme authentique au cœur du Limbourg',
    highlights: ['Parking gratuit', 'Espace privé dès 20p', 'Paiement sur facture', 'Expérience Tomahawk & magnum'],
    formula: 'Formule à partir de €55 pp — menu 3 services incl. vin, eau & café (dès 12p, pas ven/sam)',
    spaces: [
      { name: 'Le Bar', capacity: 40, desc: 'Caractéristique avec la tête de taureau et la cheminée ouverte.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
      { name: 'Cuisine Ouverte / Tomahawk', capacity: 14, desc: 'La cuisine ouverte — idéale pour une expérience viande exclusive.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
      { name: 'Le Living', capacity: 45, desc: 'Rénové avec des éléments authentiques.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
      { name: 'La Terrasse', capacity: 50, desc: 'Terrasse extérieure avec matériaux durables.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
    ],
  },
  {
    id: 'heusden-zolder', name: 'Bogèst Heusden-Zolder', city: 'Heusden-Zolder', address: 'Stationsstraat 67, 3550 Heusden-Zolder', phone: '011 18 21 20', email: 'info@bogest-heusdenzolder.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
    tagline: 'Ambiance chaleureuse près de la gare',
    highlights: ['Parking derrière le restaurant & gare', 'Espaces privés sur demande', 'Paiement sur facture', 'Menu à la carte complet pour groupes'],
    formula: 'Formule à partir de €55 pp — menu 3 services incl. vin, eau & café (dès 12p)',
    spaces: [
      { name: 'Restaurant', capacity: 80, desc: 'Restaurant chaleureusement décoré avec une ambiance authentique.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      { name: 'La Terrasse', capacity: 40, desc: 'Grande terrasse avec une ambiance agréable.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
    ],
  },
  { id: 'lommel', name: 'Bogèst Lommel', city: 'Lommel', address: 'Lommel, Limburg', phone: '', email: '', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg', tagline: 'Bientôt disponible', highlights: ['Nouvel établissement', 'Infos à venir'], formula: '', spaces: [], comingSoon: true },
  ],
  en: [
  {
    id: 'borgloon', name: 'Bogèst Borgloon', city: 'Borgloon', address: 'Graethempoort 33, 3840 Borgloon', phone: '012 22 61 20', email: 'info@bogest-borgloon.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
    tagline: 'Authentic farmhouse with five unique spaces',
    highlights: ['Free parking', 'Private room from 20p', 'Invoice payment', 'Show elements possible'],
    formula: 'Formula from €53 pp — 3-course menu incl. wine, water & coffee',
    spaces: [
      { name: 'The Bar', capacity: 40, desc: 'Ideal for aperitifs with friends.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
      { name: 'The Living Room', capacity: 44, desc: 'Central in the restaurant, very cosy for a larger group.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
      { name: 'The Counter', capacity: 25, desc: 'Smaller cosy space adjoining the kitchen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
      { name: 'The Cold Room', capacity: 42, desc: 'Unique space with a view through to the meat.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
      { name: 'The Terrace', capacity: 60, desc: 'Summer terrace with a movable roof.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
    ],
  },
  {
    id: 'hasselt', name: 'Bogèst Hasselt', city: 'Hasselt', address: 'Luikersteenweg 516, 3501 Wimmertingen', phone: '011 41 54 28', email: 'info@bogest-hasselt.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
    tagline: 'Authentic charm in the heart of Limburg',
    highlights: ['Free parking', 'Private room from 20p', 'Invoice payment', 'Tomahawk & magnum experience'],
    formula: 'Formula from €55 pp — 3-course menu incl. wine, water & coffee (from 12p, not Fri/Sat)',
    spaces: [
      { name: 'The Bar', capacity: 40, desc: 'Characterful with the bull\'s head and open fireplace.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
      { name: 'Open Kitchen / Tomahawk', capacity: 14, desc: 'The open kitchen — ideal for an exclusive meat experience.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
      { name: 'The Living Room', capacity: 45, desc: 'Renovated with authentic elements.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
      { name: 'The Terrace', capacity: 50, desc: 'Outdoor terrace with sustainable materials.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
    ],
  },
  {
    id: 'heusden-zolder', name: 'Bogèst Heusden-Zolder', city: 'Heusden-Zolder', address: 'Stationsstraat 67, 3550 Heusden-Zolder', phone: '011 18 21 20', email: 'info@bogest-heusdenzolder.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
    tagline: 'Cosy atmosphere at the station',
    highlights: ['Parking behind restaurant & station', 'Private spaces on request', 'Invoice payment', 'Full à la carte for groups'],
    formula: 'Formula from €55 pp — 3-course menu incl. wine, water & coffee (from 12p)',
    spaces: [
      { name: 'Restaurant', capacity: 80, desc: 'Warmly decorated restaurant with authentic atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      { name: 'The Terrace', capacity: 40, desc: 'Spacious terrace with a pleasant atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
    ],
  },
  { id: 'lommel', name: 'Bogèst Lommel', city: 'Lommel', address: 'Lommel, Limburg', phone: '', email: '', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg', tagline: 'Coming soon', highlights: ['New location', 'Info coming soon'], formula: '', spaces: [], comingSoon: true },
  ],
};

function LocationPanel({ loc }) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const { siteImg } = useSiteImages();

  return (
    <div className="rounded-2xl border border-border overflow-hidden transition-all duration-300"
      style={{
        background: open ? 'rgba(4,4,4,0.18)' : 'hsl(var(--card))',
        backdropFilter: open ? 'blur(32px)' : 'none',
        borderColor: open ? 'rgba(255,255,255,0.08)' : undefined,
      }}>
      <button onClick={() => !loc.comingSoon && setOpen(o => !o)}
        className={`w-full text-left flex items-center gap-5 p-5 transition-all duration-300 ${loc.comingSoon ? 'cursor-default opacity-60' : 'hover:bg-white/[0.03]'}`}>
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img src={siteImg('location.' + loc.id) || loc.image} alt={loc.name} className="w-full h-full object-cover" />
          {loc.comingSoon && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="font-body text-[8px] text-white tracking-widest uppercase text-center">{t('loc_coming_soon')}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-foreground">{loc.name}</h3>
          <p className="font-body text-xs text-primary mt-0.5">{loc.tagline}</p>
          <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{loc.address}
          </p>
        </div>
        {!loc.comingSoon && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {open ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="px-5 pb-6 border-t border-white/[0.06]">
              {loc.formula && (
                <div className="mt-5 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <p className="font-body text-sm text-foreground">{loc.formula}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {loc.highlights.map(h => (
                  <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-xs text-foreground/70"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Check className="w-3 h-3 text-primary" />{h}
                  </span>
                ))}
              </div>
              {loc.spaces.length > 0 && (
                <>
                  <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-4">{t('loc_spaces')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {loc.spaces.map((space, i) => (
                      <div key={space.name} className="rounded-xl overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="h-36 overflow-hidden">
                          <img src={siteImg('space.' + loc.id + '.' + i) || space.image} alt={space.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <h5 className="font-heading text-sm font-semibold text-foreground">{space.name}</h5>
                            <span className="inline-flex items-center gap-1 font-body text-xs text-primary">
                              <Users className="w-3 h-3" /> max. {space.capacity}p
                            </span>
                          </div>
                          <p className="font-body text-xs text-muted-foreground leading-relaxed">{space.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-3">
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs text-foreground hover:text-primary transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Phone className="w-3.5 h-3.5 text-primary" />{loc.phone}
                  </a>
                )}
                {loc.email && (
                  <a href={`mailto:${loc.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs text-foreground hover:text-primary transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Mail className="w-3.5 h-3.5 text-primary" />{loc.email}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Groups() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS = LOCATIONS_I18N[lang] || LOCATIONS_I18N.nl;
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '', location: '', date: '', notes: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1000);
  };

  const events = [
    { num: '01', title: t('grp_event_1_title'), desc: t('grp_event_1_desc') },
    { num: '02', title: t('grp_event_2_title'), desc: t('grp_event_2_desc') },
    { num: '03', title: t('grp_event_3_title'), desc: t('grp_event_3_desc') },
    { num: '04', title: t('grp_event_4_title'), desc: t('grp_event_4_desc') },
  ];

  return (
    <div className="w-full">
      <PanelHero label="Events" title={t('grp_title_main')} titleAccent={t('grp_title_accent')} subtitle={t('grp_subtitle')} positionKey="groups.hero" />

      <section className="w-full px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-16">
        <SectionReveal className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{t('grp_choose_location')}.</h2>
          <p className="font-body text-sm text-muted-foreground">{t('grp_choose_desc')}</p>
        </SectionReveal>
        <div className="space-y-3">
          {LOCATIONS.map((loc, i) => (
            <SectionReveal key={loc.id} delay={i * 0.07}>
              <div className="group relative">
                <LocationPanel loc={loc} />
                {!loc.comingSoon && <HostHint question={hostQuestion(lang, loc.name)} label={hostHintLabel(lang)} className="bottom-full mb-3 left-1/2 -translate-x-1/2" />}
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <SectionReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t('grp_request_title')}.</h2>
            <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">{t('grp_request_desc')}</p>
            {success ? (
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{t('grp_success_title')}</h3>
                <p className="font-body text-muted-foreground">{t('grp_success_msg')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder={t('grp_name')} value={form.name} onChange={e => set('name', e.target.value)} required className="bg-card border-border font-body" />
                  <Input type="email" placeholder={t('grp_email')} value={form.email} onChange={e => set('email', e.target.value)} required className="bg-card border-border font-body" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder={t('grp_phone')} value={form.phone} onChange={e => set('phone', e.target.value)} required className="bg-card border-border font-body" />
                  <Input placeholder={t('grp_guests')} value={form.guests} onChange={e => set('guests', e.target.value)} required className="bg-card border-border font-body" />
                </div>
                <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="bg-card border-border font-body" />
                <select value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">{t('grp_location_choose')}</option>
                  {['Hasselt', 'Borgloon', 'Heusden-Zolder', 'Lommel'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <textarea placeholder={t('grp_notes')} value={form.notes} onChange={e => set('notes', e.target.value)} rows={4}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <Button type="submit" disabled={loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-8 py-3 h-auto">
                  {loading ? t('grp_sending') : t('btn_send_request')}
                </Button>
              </form>
            )}
          </SectionReveal>

          <SectionReveal direction="right" delay={0.1}>
            <div className="space-y-4">
              {events.map(item => (
                <div key={item.num} className="group relative p-5 bg-card border border-border rounded-xl">
                  <div className="flex items-start gap-4">
                    <span className="font-heading text-2xl font-bold text-primary">{item.num}</span>
                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <HostHint question={hostQuestion(lang, item.title)} label={hostHintLabel(lang)} className="bottom-full mb-3 left-1/2 -translate-x-1/2" />
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}