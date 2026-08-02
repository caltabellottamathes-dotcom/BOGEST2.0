import React from 'react';
import { Calendar } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import ZenchefEmbed from './ZenchefEmbed';
import OverlayPanelShell from '@/components/OverlayPanelShell';

export default function ReservationPanel({ isOpen, onClose, zenchefId, locationName }) {
  const { t } = useLang();

  const header = (
    <>
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
        style={{ background: 'hsl(var(--primary) / 0.14)', border: '1px solid rgba(200,163,89,0.30)' }}
      >
        <Calendar className="text-primary" style={{ width: 18, height: 18 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading text-base md:text-lg font-semibold text-foreground leading-tight">
          {locationName ? locationName : t('res_title')}
        </p>
        <p className="font-body text-[11px] text-muted-foreground tracking-wide mt-0.5">{t('res_subtitle')}</p>
      </div>
    </>
  );

  return (
    <OverlayPanelShell isOpen={isOpen && !!zenchefId} onClose={onClose} header={header} scrollable={false}>
      <div className="flex-1 min-h-0 flex flex-col p-4 md:p-6">
        {/* White widget framed as a card on the warm panel — feels integrated */}
        <div
          className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col"
          style={{ background: '#ffffff', border: '1px solid rgba(200,163,89,0.20)', boxShadow: '0 12px 40px rgba(0,0,0,0.40)' }}
        >
          <ZenchefEmbed zenchefId={zenchefId} fillHeight />
        </div>
      </div>
    </OverlayPanelShell>
  );
}