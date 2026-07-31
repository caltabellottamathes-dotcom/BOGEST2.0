import React from 'react';

// The blurry glass "skirt" that floats over a panel's header image with
// rounded top corners. Wrap a panel page's in-flow content so it overlaps
// the PanelHero bottom — layered, not flush.
export default function PanelContent({ children, className = '' }) {
  return (
    <div className={`relative z-20 -mt-16 md:-mt-20 rounded-t-[2rem] border-t border-x border-border/50 bg-background/80 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}