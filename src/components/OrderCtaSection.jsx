import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

/**
 * OrderCtaSection — hét referentiesysteem voor "Bestel nu"-CTA's.
 * De langwerpige foto is vervangen door een transparant glasmorphism-vlak
 * met de bull-ghost (zoals Lommel in /locations). De zwevende glazen kaart
 * blijft 1:1 ReserveCtaSection (/menu).
 */
export default function OrderCtaSection({
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
  punct = '.',
  cardTitlePunct,
}) {
  const CtaLink = ({ children }) => {
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3">{children}</a>;
    if (to) return <Link to={to} className="group inline-flex items-center gap-3">{children}</Link>;
    return <button type="button" onClick={onClick} className="group inline-flex items-center gap-3">{children}</button>;
  };

  return (
    <section id="bestel" className="w-full px-6 md:px-10 lg:px-16 pt-14 pb-16">
      <div className="relative">
        {/* Glasmorphism-banner met bull-ghost */}
        <div
          className="relative overflow-hidden rounded-2xl h-[200px] md:h-[260px] border border-border/50"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' }}
        >
          <img
            src={BULL_MARK}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute pointer-events-none select-none"
            style={{ height: '220%', width: 'auto', bottom: '-70%', left: '-4%', opacity: 0.10, filter: 'grayscale(1) brightness(2.4)' }}
          />

          {/* Tekst links */}
          <div className="absolute left-6 md:left-8 lg:left-12 bottom-5 md:bottom-8 max-w-xs md:max-w-[15rem] lg:max-w-sm z-10">
            {eyebrow && <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2">{eyebrow}</p>}
            <h2 className="font-heading text-xl md:text-2xl font-bold leading-tight text-foreground">
              {title}
              {titleAccent && (
                <>
                  <br className="hidden md:block" /> <span className="italic text-primary">{titleAccent}</span>
                </>
              )}
              <span className="text-primary">{punct}</span>
            </h2>
            {desc && <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-3">{desc}</p>}
          </div>
        </div>

        {/* Zwevende glazen kaart — exact 1:1 ReserveCtaSection (/menu) */}
        <div
          className="relative mx-4 -mt-12 md:absolute md:-bottom-8 md:right-10 lg:right-14 md:mx-0 md:max-w-sm rounded-2xl p-5 md:p-6"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.14)', border: '1px solid hsl(var(--primary) / 0.30)' }}>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70">{cardEyebrow}</span>
          </div>
          {cardTitle && <h2 className="font-heading text-xl md:text-2xl font-bold text-white leading-tight mb-2">{cardTitle}{cardTitlePunct && <span className="text-primary">{cardTitlePunct}</span>}</h2>}
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