import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { HOURS } from '@/lib/data';

// Openingsuren: live uit de OpeningHours-entiteit (beheer), met fallback op de
// statische uren uit data.js zolang de entiteit (nog) leeg is. Dezelfde bron
// voedt de pagina én het JSON-LD-schema (E3).

export const DAY_NAMES = {
  nl: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
  fr: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CLOSED_WORDS = new Set(['gesloten', 'fermé', 'closed']);

export function baseHours(slug, lang) {
  const names = DAY_NAMES[lang] || DAY_NAMES.nl;
  const fb = HOURS[slug]?.[lang] || HOURS[slug]?.nl || [];
  return names.map((day, i) => ({ day, time: fb[i]?.time ?? '—' }));
}

export function useOpeningHours(slug, lang) {
  const [hours, setHours] = useState(() => baseHours(slug, lang));

  useEffect(() => {
    let active = true;
    setHours(baseHours(slug, lang));
    base44.entities.OpeningHours.filter({ location: slug }, 'day_index', 20)
      .then((rows) => {
        if (!active || !rows || !rows.length) return;
        const byDay = {};
        rows.forEach((r) => {
          if (r.active !== false && r.day_index != null) byDay[r.day_index] = r.hours_text;
        });
        const names = DAY_NAMES[lang] || DAY_NAMES.nl;
        const fallback = baseHours(slug, lang);
        const merged = names.map((day, i) => ({ day, time: byDay[i] != null ? byDay[i] : fallback[i].time }));
        if (active) setHours(merged);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [slug, lang]);

  return hours;
}

// Bouwt schema.org OpeningHoursSpecification uit de uren-array (zelfde bron als de pagina).
export function hoursToSpec(hours) {
  if (!hours || !hours.length) return [];
  const byDay = {};
  hours.forEach((h, i) => {
    const t = (h.time || '').toLowerCase();
    if (CLOSED_WORDS.has(t)) return;
    (h.time || '').split('/').forEach((range) => {
      const parts = range.trim().split(/[–—-]/).map((s) => s.trim());
      if (parts.length === 2 && /^\d{1,2}:\d{2}$/.test(parts[0]) && /^\d{1,2}:\d{2}$/.test(parts[1])) {
        const day = SCHEMA_DAYS[i];
        (byDay[day] = byDay[day] || []).push({ opens: parts[0], closes: parts[1] });
      }
    });
  });
  return Object.entries(byDay).map(([day, ranges]) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [day],
    opens: ranges[0].opens,
    closes: ranges[ranges.length - 1].closes,
  }));
}