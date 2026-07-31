import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { askHost } from '@/lib/hostHint';

// Animated-text host hint. On hover, a small chat icon slides in from the left,
// the words of the label reveal one-by-one, and an arrow slides in from the
// right — making the intention ("ask Bogèst") and the action clear. Position
// it via `className` (e.g. `absolute top-3 right-3 z-20`). Parent must be
// `group relative`.
export default function HostHint({ question, label = 'Vraag het aan Bogèst!', className = '' }) {
  const words = label.split(' ');
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border pointer-events-none group-hover:pointer-events-auto transition-colors duration-300 bg-transparent group-hover:bg-black/55 border-transparent group-hover:border-white/15 ${className}`}
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <MessageCircle className="w-3.5 h-3.5 text-primary opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ transitionDelay: '60ms' }} />
      <span className="flex items-center gap-[3px] font-body text-[11px] tracking-wide whitespace-nowrap text-foreground/90">
        {words.map((w, i) => (
          <span key={i} className="opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" style={{ transitionDelay: `${120 + i * 65}ms` }}>{w}</span>
        ))}
      </span>
      <ArrowRight className="w-3 h-3 text-primary opacity-0 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ transitionDelay: `${120 + words.length * 65}ms` }} />
    </button>
  );
}