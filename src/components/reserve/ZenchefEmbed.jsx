import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

/**
 * ZenChef booking flow — bare iframe only (no branded wrapper).
 * The panel provides the header/close button.
 */
export default function ZenchefEmbed({ zenchefId, fillHeight = false }) {
  const { t, lang } = useLang();
  const [loaded, setLoaded] = useState(false);

  if (!zenchefId) return null;

  const src = `https://bookings.zenchef.com/results?rid=${zenchefId}&lang=${lang}&pid=1001`;

  return (
    <div className={`relative w-full ${fillHeight ? 'flex-1 min-h-0 flex flex-col overflow-hidden' : ''}`}>
      {!loaded && (
        <div className={`flex flex-col items-center justify-center gap-3 ${fillHeight ? 'flex-1 min-h-0' : 'py-20'}`}>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="font-body text-xs tracking-wide text-muted-foreground">
            {t('res_booking_loading')}
          </p>
        </div>
      )}
      <iframe
        src={src}
        title="Bogèst Reservations"
        className="w-full"
        style={{
          minHeight: fillHeight ? '0' : '680px',
          height: fillHeight ? '100%' : 'auto',
          flex: fillHeight ? '1 1 0%' : 'none',
          border: 'none',
          display: loaded ? 'block' : 'none',
        }}
        onLoad={() => setLoaded(true)}
        allowFullScreen
      />
    </div>
  );
}