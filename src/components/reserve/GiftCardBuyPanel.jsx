import React from 'react';
import { Gift } from 'lucide-react';
import ZenchefGiftCardEmbed from './ZenchefGiftCardEmbed';
import OverlayPanelShell from '@/components/OverlayPanelShell';
import { useLang } from '@/lib/LangContext';

/**
 * Overlay panel — uitsluitend de ZenChef-widget voor het bestellen van
 * cadeaubonnen. Opent boven het /gift-cards hoofdpaneel.
 */
export default function GiftCardBuyPanel({ isOpen, onClose }) {
  const { t } = useLang();

  const header = (
    <>
      <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--primary) / 0.12)' }}>
        <Gift className="text-primary" style={{ width: 18, height: 18 }} />
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
        <ZenchefGiftCardEmbed fillHeight />
      </div>
    </OverlayPanelShell>
  );
}