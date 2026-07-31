import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useSiteImages } from '@/lib/SiteImageContext';

const FALLBACK_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';

/**
 * OrderCtaSection — hét referentiesysteem voor "Bestel nu"-CTA's op de site.
 * Spiegelt ReserveCtaSection exact: een beeldband met een asymmetrisch,
 * zwevend glazen kaartje dat de rand overlapt (rechteronderhoek).
 * Ondersteunt externe links (href), interne links (to) en acties (onClick).
 * De linktekst (eyebrow / titel / accent / beschrijving) ligt over de foto links.
 */
export default function OrderCtaSection({
  positionKey,
  eyebrow,
  title,
  titleAccent,
  desc,
  buttonLabel,
  href,
  to,
  onClick,
  icon: Icon = ExternalLink,
  cardEyebrow = 'Bogèst',
  external = false,
}) {
  const { siteImg } = useSiteImages();
  const bg = (positionKey ? siteImg(positionKey) : null) || FALLBACK_IMG;
  const isExternal = external || (!!href && !to && !onClick);

  const CtaInner = () => (
    <span className="group inline-flex items-center gap-3">
      <span className="font-body text-xs tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors duration-300">{buttonLabel}</span>
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {isExternal ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </span>
    </span>
  );

  const Cta = () => {
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex"><CtaInner /></a>;
    if (to) return <Link to={to} className="inline-flex"><CtaInner /></Link>;
    return <button type="button" onClick={onClick} className="inline-flex text-left"><CtaInner /></button>;
  };

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-14 pb-16">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl h-[260px] md:h-[340px]">
          <img src={bg} alt="" aria-hidden className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.48) 48%, rgba(0,0,0,0.12) 100%)' }} />
        </div>

        {/* Linktekst over de foto, links onderaan */}
        <div className="absolute left-6 md:left-10 lg:left-14 right-6 bottom-6 md:bottom-10 max-w-md text-white">
          {eyebrow && (
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3">{eyebrow}</p>
          )}
          <h2 className="font-heading text-2xl md:text-4xl font-bold leading-tight">
            {title}
            {titleAccent && (
              <>
                <br className="hidden md:block" /> <span className="italic text-primary">{titleAccent}</span>
              </>
            )}
            <span className="text-primary">.</span>
          </h2>
          {desc && <p className="font-body text-sm text-white/80 leading-relaxed mt-3 max-w-sm">{desc}</p>}
        </div>

        {/* Zwevend glazen kaartje — asymmetrisch, overlapt de rand (zoals ReserveCtaSection) */}
        <div
          className="relative mx-4 -mt-12 md:absolute md:-bottom-8 md:right-10 lg:right-14 md:mx-0 md:mt-0 md:max-w-[15rem] rounded-2xl p-5 md:p-6"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.35)' }}>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70">{cardEyebrow}</span>
          </div>
          <Cta />
        </div>
      </div>
    </section>
  );
}