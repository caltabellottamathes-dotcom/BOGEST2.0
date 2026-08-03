import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HomeTitle from '@/components/home/HomeTitle';

export const MONTH_NAMES = {
  nl: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],
  fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
};

export const SECTION_LABELS = {
  nl: { title: 'De Maandselectie van onze Chef.', accent: 'Chef' },
  fr: { title: 'La sélection du mois de notre Chef.', accent: 'Chef' },
  en: { title: "Our Chef's monthly selection.", accent: 'Chef' },
};

const MENU_LABELS = {
  nl: 'Volledig menu',
  fr: 'Menu complet',
  en: 'Full menu',
};

export const SUGGESTIONS = {
  nl: [
    { id: 's1', tag: 'Vis — Seizoen', name: 'Kabeljauw met witte asperges', desc: 'Gebakken kabeljauw met dagverse witte asperges, puree, fijne ravioli gevuld met asperge-crème afgewerkt met zilte groenten en een luchtige hollandaise — verrijkt met reductie van kreeft.', price: '€49,50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/e9ee6ba3f_Cod_with_white_asparagus_dish_202607211718.jpg' },
    { id: 's2', tag: 'Gevogelte — Suggestie', name: 'Poulet Noir — Asperges', desc: 'Suprème van langzaam gegaarde hoevekip, boterzacht en vol van smaak. Een verfijnde jus van cognac en tijm met dagverse witte asperges als perfecte seizoenscombinatie.', price: '€46,00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/46bf2cc7f_Poulet_Noir_Asperges_dish_photo_202607211720.jpg' },
    { id: 's3', tag: 'Klassieker — Vlaams', name: 'Asperges op Vlaamse wijze', desc: 'De tijdloze Vlaamse klassieker — verse witte asperges, gekookt ei, geklaarde boter en fijngesneden peterselie. Simpel, eerlijk, onweerstaanbaar.', price: '€36,00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/882b3ba9c_Asparagus_Flemish_style_logo_2K_202607211720.jpg' },
    { id: 's4', tag: 'Masters of Meat', name: 'Angus — Grain fed 200 dagen', desc: 'Rijk gemarmerde Angus met volle ronde smaak, uitzonderlijk sappig en diepe intense smaak. Marmering MS4+.', price: '€69,00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/65351c82b_Angus_dish_with_logo_2K_202607211722.jpg' },
    { id: 's5', tag: 'Gastronomie — Topper', name: 'Varkenswangetjes', desc: 'Botermals — delicieus — volgens de regels van de kunst — klassieke topper voor de gastronomen. (Saus is niet zoet)', price: '€39,50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/484ea39d0_Pork_cheeks_dish_on_Inox_202607211722.jpg' },
    { id: 's6', tag: 'Vis — Fris', name: 'Asperges met gerookte zalm', desc: 'Fluweelzachte asperges met gerookte zalm en een zachtgekookt eitje, overgoten met luchtig geklopte mousselinesaus.', price: '€43,50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/0d2b18917_Asparagus_with_smoked_salmon_dish_202607211723.jpg' },
  ],
  fr: [
    { id: 's1', tag: 'Poisson — Saison', name: 'Cabillaud aux asperges blanches', desc: 'Cabillaud poêlé avec des asperges blanches fraîches du jour, purée, fine ravioli garnie de crème d\'asperge, légumes iodés et hollandaise légère — enrichie d\'une réduction de homard.', price: '€49,50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/e9ee6ba3f_Cod_with_white_asparagus_dish_202607211718.jpg' },
    { id: 's2', tag: 'Volaille — Suggestion', name: 'Poulet Noir — Asperges', desc: 'Suprème de poulet de ferme cuit lentement, fondant et savoureux. Un jus raffiné au cognac et au thym avec des asperges blanches fraîches du jour comme parfaite combinaison de saison.', price: '€46,00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/46bf2cc7f_Poulet_Noir_Asperges_dish_photo_202607211720.jpg' },
    { id: 's3', tag: 'Classique — Flamand', name: 'Asperges à la flamande', desc: 'Le grand classique flamand intemporel — asperges blanches fraîches, œuf dur, beurre clarifié et persil finement haché. Simple, honnête, irrésistible.', price: '€36,00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/882b3ba9c_Asparagus_Flemish_style_logo_2K_202607211720.jpg' },
    { id: 's4', tag: 'Masters of Meat', name: 'Angus — Grain fed 200 jours', desc: 'Angus richement marbré, saveur ronde et pleine, exceptionnellement juteux et intense. Persillage MS4+.', price: '€69,00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/65351c82b_Angus_dish_with_logo_2K_202607211722.jpg' },
    { id: 's5', tag: 'Gastronomie — Coup de cœur', name: 'Joues de porc', desc: 'Fondant — délicieux — selon les règles de l\'art — un grand classique pour les gastronomes. (La sauce n\'est pas sucrée)', price: '€39,50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/484ea39d0_Pork_cheeks_dish_on_Inox_202607211722.jpg' },
    { id: 's6', tag: 'Poisson — Frais', name: 'Asperges au saumon fumé', desc: 'Asperges veloutées au saumon fumé et un œuf mollet, nappées d\'une mousseline légèrement fouettée.', price: '€43,50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/0d2b18917_Asparagus_with_smoked_salmon_dish_202607211723.jpg' },
  ],
  en: [
    { id: 's1', tag: 'Fish — Season', name: 'Cod with white asparagus', desc: 'Pan-fried cod with fresh daily white asparagus, mash, fine ravioli filled with asparagus cream, briny greens and a light hollandaise — enriched with lobster reduction.', price: '€49.50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/e9ee6ba3f_Cod_with_white_asparagus_dish_202607211718.jpg' },
    { id: 's2', tag: 'Poultry — Suggestion', name: 'Poulet Noir — Asparagus', desc: 'Supreme of slowly braised farm chicken, meltingly tender and full of flavour. A refined cognac and thyme jus with fresh daily white asparagus as the perfect seasonal pairing.', price: '€46.00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/46bf2cc7f_Poulet_Noir_Asperges_dish_photo_202607211720.jpg' },
    { id: 's3', tag: 'Classic — Flemish', name: 'Asparagus Flemish style', desc: 'The timeless Flemish classic — fresh white asparagus, hard-boiled egg, clarified butter and finely chopped parsley. Simple, honest, irresistible.', price: '€36.00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/882b3ba9c_Asparagus_Flemish_style_logo_2K_202607211720.jpg' },
    { id: 's4', tag: 'Masters of Meat', name: 'Angus — Grain fed 200 days', desc: 'Richly marbled Angus with full round flavour, exceptionally juicy and deeply intense. Marbling MS4+.', price: '€69.00', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/65351c82b_Angus_dish_with_logo_2K_202607211722.jpg' },
    { id: 's5', tag: 'Gastronomy — Star dish', name: 'Pork cheeks', desc: 'Meltingly tender — delicious — crafted to perfection — a classic star dish for gastronomes. (Sauce is not sweet)', price: '€39.50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/484ea39d0_Pork_cheeks_dish_on_Inox_202607211722.jpg' },
    { id: 's6', tag: 'Fish — Fresh', name: 'Asparagus with smoked salmon', desc: 'Velvety asparagus with smoked salmon and a soft-boiled egg, drizzled with a lightly whipped mousseline sauce.', price: '€43.50', image: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/0d2b18917_Asparagus_with_smoked_salmon_dish_202607211723.jpg' },
  ],
};

// One calm card: image, a single static tag pill, a price, a title, and a
// two-line description. No hover-reveal "ask host" CTA, no expand/collapse,
// no read-more, no image zoom — the photo and the dish name lead.
export function SuggestionCard({ item }) {
  const { lang: _lang } = useLang();
  const { siteImg } = useSiteImages();
  const seasonalIdx = Number(String(item.id).replace('s', '')) - 1;

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[360px] relative">
      <div className="relative overflow-hidden rounded-2xl h-72 mb-5">
        <img
          src={siteImg('seasonal.' + seasonalIdx)}
          data-bb-key={`seasonal.${seasonalIdx}`}
          data-bb-label={`Seizoenssuggestie ${seasonalIdx + 1}`}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.82) brightness(0.95)' }}
          loading="lazy" decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <span className="absolute top-4 left-4 font-body text-[10px] tracking-[0.2em] uppercase text-white/90 whitespace-nowrap px-3 py-1 bg-black/35 backdrop-blur-md rounded-full">
          {item.tag}
        </span>
        <div className="absolute bottom-4 right-4">
          <span className="inline-block px-3 py-2 bg-white/15 backdrop-blur-md text-white font-heading text-base font-bold rounded-lg border border-white/20">
            {item.price}
          </span>
        </div>
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground mb-2 leading-tight">
        {item.name}
      </h3>
      <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.desc}</p>
    </div>
  );
}

export default function SeasonalSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { lang } = useLang();
  const now = new Date();
  const monthLabel = MONTH_NAMES[lang]?.[now.getMonth()] || MONTH_NAMES.nl[now.getMonth()];
  const yearLabel = now.getFullYear();
  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.nl;

  return (
    <section id="suggesties" className="relative w-full py-14 md:py-20">
      <div className="relative w-full px-6 md:px-10 lg:px-16">
        {/* Header — one focal title, one quiet date, one link. No ghost bull,
            no gradient, no scroll-arrow buttons (native scroll/swipe is enough). */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
        >
          <div>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">
              {monthLabel} {yearLabel}
            </span>
            <HomeTitle
              title={(SECTION_LABELS[lang] || SECTION_LABELS.nl).title}
              accent={(SECTION_LABELS[lang] || SECTION_LABELS.nl).accent}
            />
          </div>
          <Link to="/menu"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors duration-300">
            {MENU_LABELS[lang] || MENU_LABELS.nl}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* Horizontal scroll — native, no per-card stagger animation */}
      <div
        className="flex gap-5 overflow-x-auto pl-6 md:pl-10 lg:pl-16 pr-6 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {suggestions.map((item) => (
          <div key={item.id} className="snap-start">
            <SuggestionCard item={item} />
          </div>
        ))}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
  );
}