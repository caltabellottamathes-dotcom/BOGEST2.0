import React from 'react';
import { CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import OrderCtaSection from '@/components/OrderCtaSection';

// Reserveer-CTA — exact hetzelfde systeem als de Traiteur- en Cadeaupakket-CTA
// (OrderCtaSection), met reserve-specifieke copy. De banner-titel is een
// uitnodigende vraag ("Goesting gekregen?") met een geel vraagteken; de kaart
// sluit af met "Reserveer uw tafel." + gele punt.
const BANNER = {
  nl: { title: 'Goesting gekregen', punct: '?' },
  fr: { title: 'Envie', punct: '?' },
  en: { title: 'Fancy it', punct: '?' },
};
const CARD = {
  nl: { title: 'Reserveer uw tafel', subtitle: 'Bogèst Hasselt, Borgloon of Heusden-Zolder. Wij houden een plaats voor u klaar.' },
  fr: { title: 'Réservez votre table', subtitle: 'Bogèst Hasselt, Borgloon ou Heusden-Zolder. Une place vous attend.' },
  en: { title: 'Reserve your table', subtitle: 'Bogèst Hasselt, Borgloon or Heusden-Zolder. A seat is kept for you.' },
};

export default function ReserveCtaSection({ positionKey }) {
  const { t, lang } = useLang();
  const banner = BANNER[lang] || BANNER.nl;
  const card = CARD[lang] || CARD.nl;
  return (
    <OrderCtaSection
      positionKey={positionKey}
      eyebrow={t('btn_reserve')}
      title={banner.title}
      punct={banner.punct}
      desc={t('res_subtitle')}
      cardTitle={card.title}
      cardTitlePunct="."
      cardSubtitle={card.subtitle}
      buttonLabel={t('btn_reserve')}
      to="/reserveren"
      icon={CalendarDays}
    />
  );
}