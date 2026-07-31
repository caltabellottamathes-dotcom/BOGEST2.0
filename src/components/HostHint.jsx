import React from 'react';
import { MessageCircle } from 'lucide-react';
import { askHost } from '@/lib/hostHint';

// Subtle hover hint styled like the digital host chat (frosted glass + gold).
// Place inside a `group` element; control visibility/position via className.
export default function HostHint({ question, label = 'Vraag het aan Bogèst!', className = '' }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.16)',
      }}
    >
      <MessageCircle className="w-3 h-3 text-primary" />
      <span className="font-body text-[10px] tracking-wide" style={{ color: 'rgba(255,235,160,0.92)' }}>
        {label}
      </span>
    </button>
  );
}