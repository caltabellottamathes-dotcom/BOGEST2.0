import React from 'react';

// Shared section title for the homepage. One word is set in italic gold (like
// the panel titles), and on hover the base text and the accent swap colours so
// every home title reacts the same way.
export default function HomeTitle({ title, accent, breakLine = false, className = '' }) {
  const base =
    'group font-heading text-[clamp(2rem,8vw,2.4rem)] md:text-4xl lg:text-5xl font-bold text-foreground leading-tight transition-colors duration-300 cursor-default hover:text-primary';

  const Accent = () => (
    <span className="italic text-primary transition-colors duration-300 group-hover:text-foreground">
      {accent}
    </span>
  );

  if (!accent) {
    return <h2 className={`${base} ${className}`}>{title}</h2>;
  }

  // breakLine: the accent is a separate phrase shown on its own line.
  if (breakLine) {
    return (
      <h2 className={`${base} ${className}`}>
        {title}
        <br />
        <Accent />
      </h2>
    );
  }

  // Inline: the accent is one word inside the title string.
  const idx = title.indexOf(accent);
  if (idx === -1) {
    return (
      <h2 className={`${base} ${className}`}>
        {title} <Accent />
      </h2>
    );
  }
  const before = title.slice(0, idx);
  const after = title.slice(idx + accent.length);
  return (
    <h2 className={`${base} ${className}`}>
      {before}
      <Accent />
      {after}
    </h2>
  );
}