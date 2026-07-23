import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const SHOP_ID = 'sh_a047fd05-b175-4b05-8ab0-9f7e69d45c36';

/**
 * ZenChef gift card shop — bare iframe only (no branded wrapper).
 * The panel provides the header/close button.
 */
export default function ZenchefGiftCardEmbed({ fillHeight = false }) {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);

  const src = `https://shop.zenchef.com/?active-collection=vouchers&collections=vouchers&shop-id=${SHOP_ID}&language=${lang}&primary-color=e7cd70`;

  return (
    <div className={`relative w-full ${fillHeight ? 'flex-1 min-h-0 flex flex-col overflow-hidden' : ''}`}>
      {!loaded && (
        <div className={`flex flex-col items-center justify-center gap-3 ${fillHeight ? 'flex-1 min-h-0' : 'py-20'}`}>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="font-body text-xs tracking-wide text-muted-foreground">
            Cadeaubonnen laden…
          </p>
        </div>
      )}
      <iframe
        src={src}
        title="Bogèst Cadeaubonnen"
        className="w-full"
        style={{
          minHeight: fillHeight ? '0' : '760px',
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