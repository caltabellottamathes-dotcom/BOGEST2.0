import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Haalt actieve, niet-verlopen meldingen op (automatisch verbergen na einddatum).
// currentLocation: 'hasselt' | 'borgloon' | 'heusden-zolder' | null.
export function useAnnouncements(currentLocation = null) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const all = await base44.entities.Announcement.list('-sort_order', 50);
        const now = new Date();
        const valid = (all || []).filter((a) => {
          if (a.active === false) return false;
          const start = a.start_date ? new Date(a.start_date) : null;
          const end = a.end_date ? new Date(a.end_date) : null;
          if (start && now < start) return false;
          if (end && now > end) return false;
          if (a.location && a.location !== 'all' && currentLocation && a.location !== currentLocation) return false;
          return true;
        });
        if (active) setItems(valid);
      } catch {
        /* publieke site: stilvallen bij fout */
      }
    };
    load();
    // Elke minuut herzien → meldingen verdwijnen automatisch op hun einddatum.
    const id = setInterval(load, 60000);
    let unsub;
    try {
      unsub = base44.entities.Announcement.subscribe?.(() => load());
    } catch {}
    return () => {
      active = false;
      clearInterval(id);
      if (unsub) try { unsub(); } catch {}
    };
  }, [currentLocation]);

  return items;
}