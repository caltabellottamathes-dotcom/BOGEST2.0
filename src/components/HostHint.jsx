import React from 'react';
import { askHost } from '@/lib/hostHint';

// "Vraag het aan Bogèst" — a quiet invitation in the same tracked, all-caps
// body type as the section eyebrows. White, no extra font, no monogram. It
// only appears on hover and is placed so it never sits over readable text.
//
// HostHint (default)        — hover-gated chip/inline (image cards, menu rows).
// HintLine (named export)  — plain, always-visible chip for expand-at-bottom
//                             areas (location/CTA cards, accordion content).

const FULL = 'Vraag het aan Bogèst';

function Mark({ label = FULL }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase text-white/90">
      <span className="w-1 h-1 rounded-full bg-white/70 flex-shrink-0" />
      {label}
      <span className="text-white/50">→</span>
    </span>
  );
}

export default function HostHint({ question, label = FULL, className = '', variant = 'note' }) {
  const onClick = (e) => { e.preventDefault(); e.stopPropagation(); askHost(question); };

  if (variant === 'inline') {
    return (
      <button type="button" onClick={onClick}
        className="inline-flex items-center overflow-hidden max-w-0 group-hover:max-w-[260px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto">
        <span className="inline-flex items-center whitespace-nowrap pl-2">
          <Mark label={label} />
        </span>
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out ${className}`}>
      <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-black/45 border border-white/15">
        <Mark label={label} />
      </span>
    </button>
  );
}

export function HintLine({ question, label = FULL, className = '' }) {
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
      className={`inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-black/45 border border-white/15 ${className}`}>
      <Mark label={label} />
    </button>
  );
}