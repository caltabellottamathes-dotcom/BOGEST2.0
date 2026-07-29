import React from 'react';
import { useTheme } from '@/lib/ThemeContext';

/**
 * Accent toggle — switches the site between the two dark themes:
 * yellow (gold) and green (olive green). Both share the dark background;
 * only the accent colour changes.
 */
const OPTIONS = [
  { id: 'yellow', color: 'hsl(47 73% 67%)', label: 'Geel accent' },
  { id: 'green', color: 'hsl(82 42% 56%)', label: 'Groen accent' },
];

export default function AccentToggle({ className = '' }) {
  const { accent, setAccent } = useTheme();
  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="group" aria-label="Accentkleur wisselen">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setAccent(opt.id)}
          title={opt.label}
          aria-label={opt.label}
          aria-pressed={accent === opt.id}
          className="w-5 h-5 rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: opt.color,
            outline: accent === opt.id ? '2px solid hsl(var(--foreground))' : '2px solid transparent',
            outlineOffset: 1,
            boxShadow: accent === opt.id ? '0 0 0 1px rgba(0,0,0,0.25)' : 'none',
          }}
        />
      ))}
    </div>
  );
}