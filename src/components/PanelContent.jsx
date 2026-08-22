import React from 'react';

// The frosted-glass "skirt" that floats over a panel's header. A subtle
// layered gradient gives depth across every panel; each panel ends with a
// minimalist footer — purely a visual "einde" indication.
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
      {/* Gelaagde gradient — subtiele diepte over alle panelen */}
      <div className="absolute inset-0 pointer-events-none rounded-t-[2rem]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 16%, transparent 82%, rgba(40,36,28,0.12) 100%)' }} />
      <div className="relative z-10">
        {children}
        {/* Subtiele einde-van-paneel footer */}
        <footer className="flex flex-col items-center gap-3 py-10 md:py-12 px-6 select-none">
          <span className="h-px w-10 bg-primary/40" />
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground/70">Bogèst</span>
        </footer>
      </div>
    </div>
  );
}