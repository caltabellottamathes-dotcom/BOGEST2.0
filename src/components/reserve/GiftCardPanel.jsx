import React, { useState } from 'react';
import { Gift, Wallet } from 'lucide-react';
import ZenchefGiftCardEmbed from './ZenchefGiftCardEmbed';
import GiftCardChecker from '@/components/GiftCardChecker';
import OverlayPanelShell from '@/components/OverlayPanelShell';
import { useLang } from '@/lib/LangContext';

export default function GiftCardPanel({ isOpen, onClose }) {
  const { t } = useLang();
  const [tab, setTab] = useState('buy');

  const header = (
    <>
      <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--primary) / 0.12)' }}>
        <Gift className="text-primary" style={{ width: 18, height: 18 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading text-base md:text-lg font-semibold text-foreground leading-tight">{t('gc_title')}</p>
        <p className="font-body text-[11px] text-muted-foreground tracking-wide mt-0.5">{t('gc_panel_subtitle')}</p>
      </div>
    </>
  );

  const tabBtn = (active) => ({
    background: active ? 'hsl(var(--primary))' : 'transparent',
    color: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
    border: active ? 'none' : '1px solid hsl(var(--border))',
  });

  return (
    <OverlayPanelShell isOpen={isOpen} onClose={onClose} header={header} scrollable={false}>
      {/* Tab toggle */}
      <div className="flex gap-2 px-4 md:px-6 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid hsl(var(--border) / 0.4)' }}>
        <button
          onClick={() => setTab('buy')}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all"
          style={tabBtn(tab === 'buy')}
        >
          <Gift className="w-3.5 h-3.5" />
          {t('gc_title')}
        </button>
        <button
          onClick={() => setTab('check')}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all"
          style={tabBtn(tab === 'check')}
        >
          <Wallet className="w-3.5 h-3.5" />
          {t('gc_balance_title')}
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {tab === 'buy' ? (
          <div className="flex-1 min-h-0 flex flex-col p-4 md:p-6">
            <ZenchefGiftCardEmbed fillHeight />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
            <GiftCardChecker />
          </div>
        )}
      </div>
    </OverlayPanelShell>
  );
}