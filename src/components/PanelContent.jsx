import React from 'react';

// The frosted-glass "skirt" that floats over a panel's header with rounded
// top corners and a soft shadow onto the hero. Every panel ends with a
// subtle, minimalist footer — purely a visual "einde" indication.
export default function PanelContent({ children, className = '' }) {
  return (
    <div
      className={`relative z-20 -mt-16 md:-mt-20 rounded-t-[2rem] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px) saturate(140%)',
        WebkitBackdropFilter: 'blur(10px) saturate(140%)',
        borderTop: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 -24px 50px -14px rgba(0,0,0,0.40)',
      }}
    >
      {children}
      {/* Subtiele einde-van-paneel footer */}
      <footer className="flex flex-col items-center gap-3 py-14 md:py-20 px-6 select-none">
        <span className="h-px w-10 bg-primary/40" />
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground/70">Bogèst</span>
      </footer>
    </div>
  );
}