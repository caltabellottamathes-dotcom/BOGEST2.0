import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram as InstagramIcon } from 'lucide-react';
import { useSiteImages } from '@/lib/SiteImageContext';

/**
 * De drie About-kaarten als één gelaagde compositie — de kaarten zweven
 * subtiel over elkaar (verticale offset + z-index), met een glas-caption die
 * over de onderkant van elke foto zweeft. Premium en dynamischer dan een
 * plat raster.
 */
const CARDS = [
  {
    to: '/about/ons-verhaal',
    num: '01',
    title: 'Ons verhaal',
    desc: 'De mensen, de sfeer en het gebaar achter Bogèst.',
    img: 'about.card1',
    cta: 'Lees verder',
  },
  {
    to: '/about/onze-filosofie',
    num: '02',
    title: 'Onze filosofie',
    desc: 'Formule, ambacht, wijnen en sfeer — de pijlers van Bogèst.',
    img: 'philosophy.0',
    cta: 'Ontdek',
  },
  {
    to: '/about/instagram',
    num: '03',
    title: 'Achter de schermen',
    desc: 'Sfeerbeelden en momenten, live vanuit onze vestigingen.',
    img: 'about.card2',
    cta: 'Bekijk',
    ig: true,
  },
];

// Per-kaart layering: verticale offset + z-index + horizontale overlap.
const LAYER = [
  'md:mt-12 md:-mr-5 z-20',
  'md:mt-0 z-30',
  'md:mt-16 md:-ml-5 z-10',
];
const MOBILE = ['mb-[-1.25rem] z-30', 'z-20', '-mt-[1.25rem] z-10'];

export default function AboutCardGrid() {
  const { siteImg } = useSiteImages();
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:justify-center max-w-5xl mx-auto">
      {CARDS.map((c, i) => (
        <Link
          key={c.to}
          to={c.to}
          className={`group relative block w-full max-w-sm md:w-[36%] ${LAYER[i]} ${MOBILE[i]}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/50 aspect-[3/4] shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:z-40">
            <img
              src={siteImg(c.img)}
              alt={c.title}
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              style={{ filter: 'saturate(0.88) brightness(0.94)' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

            {/* num */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="h-px w-6 bg-white/60" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-white/80">{c.num}</span>
            </div>

            {/* zwevende glas-caption over de onderrand */}
            <div
              className="absolute left-4 right-4 bottom-4 rounded-xl p-4"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(14px) saturate(140%)',
                WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                border: '1px solid rgba(255,255,255,0.16)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
              }}
            >
              <h3 className="font-heading text-lg font-bold text-white leading-tight mb-1">
                {c.title}<span className="text-primary">.</span>
              </h3>
              <p className="font-body text-xs text-white/70 leading-snug mb-2 line-clamp-2">{c.desc}</p>
              <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.3em] uppercase text-primary transition-all duration-300 group-hover:gap-2.5">
                {c.ig && <InstagramIcon className="w-3 h-3" />}
                {c.cta}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}