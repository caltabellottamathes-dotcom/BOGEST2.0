import React from 'react';
import { Gift, Wine, Martini, Sparkles, ArrowDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import PanelSwitcher from '@/components/PanelSwitcher';

const PKG_IMG = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/b7bb6162b_generated_image.png';

/**
 * TakeawayGiftPackagesSection — PanelSwitcher (beeld links, inhoud rechts)
 * met de drie cadeaupakketten en een verwijzing naar dezelfde bestelknop
 * hieronder (id="takeaway-order"). Geen link naar /gift-cards.
 */
export default function TakeawayGiftPackagesSection() {
  const { t } = useLang();
  const items = [
    { icon: Wine, title: t('ta_gp_wine_t'), body: t('ta_gp_wine_d'), img: PKG_IMG, bbKey: 'takeaway.pkg.0', bbLabel: 'Cadeaupakket — Wijn' },
    { icon: Martini, title: t('ta_gp_gin_t'), body: t('ta_gp_gin_d'), img: PKG_IMG, bbKey: 'takeaway.pkg.1', bbLabel: 'Cadeaupakket — Gin' },
    { icon: Sparkles, title: t('ta_gp_custom_t'), body: t('ta_gp_custom_d'), img: PKG_IMG, bbKey: 'takeaway.pkg.2', bbLabel: 'Cadeaupakket — Op maat' },
  ];
  return (
    <PanelSwitcher
      items={items}
      label={t('ta_gp_label')}
      icon={Gift}
      title={t('ta_gp_title')}
      titleAccent={t('ta_gp_accent')}
      lead={t('ta_gift_desc')}
      chipLabel={t('ta_gp_pick')}
      divider
      ghostBull={false}
      footer={
        <>
          <p className="font-body text-xs text-muted-foreground mt-6">{t('ta_gp_note')}</p>
          <a href="#takeaway-order" className="group inline-flex items-center gap-2 mt-3 font-body text-[11px] tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors duration-300">
            {t('ta_gp_btn')}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowDown className="w-4 h-4" />
            </span>
          </a>
        </>
      }
    />
  );
}