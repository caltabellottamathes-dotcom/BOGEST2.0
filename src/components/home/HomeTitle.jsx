import React from 'react';

// Shared section title for the homepage. One word is set in italic gold (like
// the panel titles), and on hover the base text and the accent swap colours so
// every home title reacts the same way. Every title closes with a gold period —
// the recurring "opposite colour" punctuation mark used across the site. Any
// trailing period already present in the title/accent text is stripped so the
// styled period is the only one rendered.
const Period = () => <span className="not-italic text-primary">.</span>;

const stripPeriod = (s) => (s ? s.replace(/\.$/, '') : s);

export default function HomeTitle({ title, accent, breakLine = false, className = '' }) {
  const base =
    'group font-heading text-[clamp(2rem,8vw,2.4rem)] md:text-4xl lg:text-5xl font-bold text-foreground leading-tight transition-colors duration-300 cursor-default hover:text-primary';

  const Accent = () => (
    <span className="italic text-primary transition-colors duration-300 group-hover:text-foreground">
      {stripPeriod(accent)}
    </span>
  );

  if (!accent) {
    return <h2 className={`${base} ${className}`}>{stripPeriod(title)}<Period /></h2>;
  }

  // breakLine: the accent is a separate phrase shown on its own line.
  if (breakLine) {
    return (
      <h2 className={`${base} ${className}`}>
        {stripPeriod(title)}
        <br />
        <Accent /><Period />
      </h2>
    );
  }

  // Inline: the accent is one word inside the title string.
  const idx = title.indexOf(accent);
  if (idx === -1) {
    return (
      <h2 className={`${base} ${className}`}>
        {stripPeriod(title)} <Accent /><Period />
      </h2>
    );
  }
  const before = title.slice(0, idx);
  const after = stripPeriod(title.slice(idx + accent.length));
  return (
    <h2 className={`${base} ${className}`}>
      {before}
      <Accent />
      {after}<Period />
    </h2>
  );
}