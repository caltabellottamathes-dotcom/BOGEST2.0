import React from 'react';
import { Gift } from 'lucide-react';
import ZenchefGiftCardEmbed from './ZenchefGiftCardEmbed';
import OverlayPanelShell from '@/components/OverlayPanelShell';
import { useLang } from '@/lib/LangContext';

const COPY = {
  nl: { intro: 'Een cadeau dat smaakt naar meer — digitaal in de mailbox of fysiek om af te halen.', tagDigital: 'Digitaal · per e-mail', tagPhysical: 'Fysiek · afhalen' },
  fr: { intro: "Un cadeau qui invite à revenir — numérique par e-mail ou physique à retirer.", tagDigital: 'Numérique · par e-mail', tagPhysical: 'Physique · à retirer' },
  en: { intro: 'A gift that tastes of more — digital by email or physical to pick up.', tagDigital: 'Digital · by email', tagPhysical: 'Physical · pickup' },
};

/**
 * Overlay panel — uitsluitend de ZenChef-widget voor het bestellen van
 * cadeaubonnen. Opent boven het /gift-cards hoofdpaneel.
 */
export default function GiftCardBuyPanel({ isOpen, onClose }) {
  const { t, lang } = useLang();
  const c = COPY[lang] || COPY.nl;

  const header = (
    <>
      <div
        className="flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0"
        style={{ background: 'hsl(var(--primary) / 0.16)', border: '1px solid rgba(200,163,89,0.35)' }}
      >
        <Gift className="text-primary" style={{ width: 20, height: 20 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading text-base md:text-lg font-semibold text-foreground leading-tight">{t('gc_title')}</p>
        <p className="font-body text-[11px] text-muted-foreground tracking-wide mt-0.5">{t('gc_cta_desc')}</p>
      </div>
    </>
  );

  return (
    <OverlayPanelShell isOpen={isOpen} onClose={onClose} header={header} scrollable={false}>
      <div className="flex-1 min-h-0 flex flex-col p-4 md:p-6">
        {/* Editorial intro — geeft het paneel een eigen identiteit boven de widget */}
        <div className="flex-shrink-0 mb-4 md:mb-5">
          <p className="font-heading text-base md:text-lg text-foreground leading-snug max-w-md">{c.intro}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase text-muted-foreground" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,163,89,0.18)' }}>
              <span className="w-1 h-1 rounded-full bg-primary" />{c.tagDigital}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase text-muted-foreground" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,163,89,0.18)' }}>
              <span className="w-1 h-1 rounded-full bg-primary" />{c.tagPhysical}
            </span>
          </div>
        </div>

        {/* White widget framed as a card on the warm panel — feels integrated */}
        <div
          className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col"
          style={{ background: '#ffffff', border: '1px solid rgba(200,163,89,0.20)', boxShadow: '0 12px 40px rgba(0,0,0,0.40)' }}
        >
          <ZenchefGiftCardEmbed fillHeight />
        </div>
      </div>
    </OverlayPanelShell>
  );
}