import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteImages } from '@/lib/SiteImageContext';

const FALLBACK_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';

/**
 * OrderCtaSection — hét referentiesysteem voor "Bestel nu"-CTA's.
 * De zwevende glazen kaart is 1:1 ReserveCtaSection (/menu):zelfde
 * verhoudingen, positie, glasant, en dezelfde opbouw (icoon + "Bogèst" +
 * titel + ondertitel + knop met cirkel-pijl). Het enige verschil: de
 * paginateksten zweven links over de foto (omdat er een 3e partij aan te
 * pas komt — bogest-online / ZenChef).
 */
export default function OrderCtaSection({
  positionKey,
  eyebrow,
  title,
  titleAccent,
  desc,
  cardTitle,
  cardSubtitle,
  buttonLabel,
  href,
  to,
  onClick,
  icon: Icon = ArrowRight,
  cardEyebrow = 'Bogèst',
}) {
  const { siteImg } = useSiteImages();
  const bg = (positionKey ? siteImg(positionKey) : null) || FALLBACK_IMG;

  const CtaLink = ({ children }) => {
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3">{children}</a>;
    if (to) return <Link to={to} className="group inline-flex items-center gap-3">{children}</Link>;
    return <button type="button" onClick={onClick} className="group inline-flex items-center gap-3">{children}</button>;
  };

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-14 pb-16">
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl h-[200px] md:h-[260px]">
          <img src={bg} alt="" aria-hidden className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(95deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.10) 100%)' }} />

          {/* Tekst links — zweeft over de foto */}
          <div className="absolute left-6 md:left-8 lg:left-12 bottom-5 md:bottom-8 max-w-xs md:max-w-[13rem] lg:max-w-xs z-10 text-white" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>
            {eyebrow && <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">{eyebrow}</p>}
            <h2 className="font-heading text-xl md:text-2xl font-bold leading-tight">
              {title}
              {titleAccent && (
                <>
                  <br className="hidden md:block" /> <span className="italic text-primary">{titleAccent}</span>
                </>
              )}
              <span className="text-primary">.</span>
            </h2>
            {desc && <p className="font-body text-xs md:text-sm text-white/80 leading-relaxed mt-2 line-clamp-3">{desc}</p>}
          </div>
        </div>

        {/* Zwevende glazen kaart — exact 1:1 ReserveCtaSection (/menu) */}
        <div
          className="relative mx-4 -mt-12 md:absolute md:-bottom-8 md:right-10 lg:right-14 md:mx-0 md:mt-0 md:max-w-sm rounded-2xl p-5 md:p-6"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.35)' }}>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70">{cardEyebrow}</span>
          </div>
          {cardTitle && <h2 className="font-heading text-xl md:text-2xl font-bold text-white leading-tight mb-2">{cardTitle}</h2>}
          {cardSubtitle && <p className="font-body text-sm text-white/70 leading-relaxed mb-5">{cardSubtitle}</p>}
          <CtaLink>
            <span className="font-body text-xs tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors duration-300">{buttonLabel}</span>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </CtaLink>
        </div>
      </div>
    </section>
  );
}