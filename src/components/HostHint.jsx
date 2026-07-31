import React from 'react';
import { MessageCircle } from 'lucide-react';
import { askHost } from '@/lib/hostHint';

// Minimal, easy-to-click host hint — a small icon button that appears on
// hover. No floating bubble, tail, or animation. Position it via `className`
// (e.g. `absolute top-3 right-3 z-20` for cards, or nothing for inline use).
// The parent must be `group relative`.
export default function HostHint({ question, label = 'Vraag het aan Bogèst!', className = '' }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${className}`}
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <MessageCircle className="w-4 h-4 text-primary" />
    </button>
  );
}