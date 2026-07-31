import React from 'react';

// The frosted-glass "skirt" that floats over a panel's header image with
// rounded top corners and casts a soft shadow onto the hero. Its glass
// matches the slide-out panel surface exactly (same tint + blur), so every
// transparent part of every panel reads like the menu panel.
export default function PanelContent({ children, className = '' }) {
  return (
    <div
      className={`relative z-20 -mt-16 md:-mt-20 rounded-t-[2rem] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px) saturate(140%)',
        WebkitBackdropFilter: 'blur(10px) saturate(140%)',
        borderTop: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 -30px 60px -12px rgba(0,0,0,0.55)',
      }}
    >
      {children}
    </div>
  );
}