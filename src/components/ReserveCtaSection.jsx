import React from 'react';
import { CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import OrderCtaSection from '@/components/OrderCtaSection';

// Reserveer-CTA — exact hetzelfde systeem als de Traiteur- en Cadeaupakket-CTA
// (OrderCtaSection): dezelfde glas-banner met bull-ghost en dezelfde zwevende
// glazen kaart (icoon + Bogèst-eyebrow + titel + subtekst + knop), maar dan met
// reserve-specifieke copy. Eén bron van waarheid voor alle "Reserveer"-CTA's
// (/menu, /over-ons en de sub-paneelen).
const CARD = {
  nl: { title: 'Reserveer uw tafel', subtitle: 'Bogèst Hasselt, Borgloon of Heusden-Zolder. Wij houden een plaats voor u klaar.' },
  fr: { title: 'Réservez votre table', subtitle: 'Bogèst Hasselt, Borgloon ou Heusden-Zolder. Une place vous attend.' },
  en: { title: 'Reserve your table', subtitle: 'Bogèst Hasselt, Borgloon or Heusden-Zolder. A seat is kept for you.' },
};

export default function ReserveCtaSection({ positionKey }) {
  const { t, lang } = useLang();
  const card = CARD[lang] || CARD.nl;
  return (
    <OrderCtaSection
      positionKey={positionKey}
      eyebrow={t('btn_reserve')}
      title={t('res_title')}
      desc={t('res_subtitle')}
      cardTitle={card.title}
      cardSubtitle={card.subtitle}
      buttonLabel={t('btn_reserve')}
      to="/reserveren"
      icon={CalendarDays}
    />
  );
}