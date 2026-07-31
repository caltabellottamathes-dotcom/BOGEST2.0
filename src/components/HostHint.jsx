import React from 'react';
import { MessageCircle } from 'lucide-react';
import { askHost } from '@/lib/hostHint';

// Floating host hint — a frosted-glass bubble with a tail that gently bobs.
// Position it via `className` (e.g. `bottom-full mb-3 left-1/2 -translate-x-1/2`
// to float above the item, or `top-4 ...` / `bottom-6 ...` to float over it).
// The parent must be `group relative`.
export default function HostHint({ question, label = 'Vraag het aan Bogèst!', className = '' }) {
  return (
    <span
      className={`pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity duration-300 z-30 ${className}`}
      style={{ position: 'absolute' }}
    >
      <span className="block" style={{ animation: 'bogest-hint-float 2.6s ease-in-out infinite' }}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
          className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl whitespace-nowrap"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            border: '1px solid rgba(255,235,160,0.35)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}
        >
          <span className="flex items-center justify-center w-4 h-4 rounded-full" style={{ background: 'rgba(231,205,112,0.22)' }}>
            <MessageCircle className="w-2.5 h-2.5 text-primary" />
          </span>
          <span className="font-body text-[11px] tracking-wide" style={{ color: 'rgba(255,238,180,0.96)' }}>{label}</span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 rotate-45"
            style={{ background: 'rgba(255,255,255,0.10)', borderBottom: '1px solid rgba(255,235,160,0.35)', borderRight: '1px solid rgba(255,235,160,0.35)' }} />
        </button>
      </span>
    </span>
  );
}