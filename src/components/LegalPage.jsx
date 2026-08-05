import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useLang } from '@/lib/LangContext';

// Shared renderer for the legal pages (Privacy, Terms, Cookie policy,
// AI Disclaimer). The body is authored as Markdown and rendered faithfully
// in an editorial Bogèst layout: gold "Juridisch" kicker, large display
// heading, hairline-separated sections, readable body text with strong
// contrast on the frosted-glass panel surface.
const LEGAL_LABEL = { nl: 'Juridisch', fr: 'Juridique', en: 'Legal' };

const mdComponents = {
  h1: ({ children }) => (
    <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
      {children}<span className="text-primary">.</span>
    </h1>
  ),
  h2: ({ children }) => (
    <>
      <div className="flex items-center gap-3 mt-12 mb-4">
        <span className="block w-6 h-px bg-primary/60" />
        <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight">
          {children}
        </h2>
      </div>
    </>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mt-7 mb-2.5">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="font-body text-[15px] md:text-base text-foreground/80 leading-[1.75] mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="font-body text-[15px] md:text-base text-foreground/80 leading-[1.7] space-y-2 mb-5 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="font-body text-[15px] md:text-base text-foreground/80 leading-[1.7] space-y-2 mb-5 ml-6 list-decimal marker:text-primary/70">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 relative">
      <span className="text-primary/70 mr-2 select-none">—</span>
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-foreground/70">{children}</em>,
  hr: () => <hr className="border-border/40 my-10" />,
  a: ({ children, href }) => (
    <a href={href} className="text-primary underline underline-offset-2 hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
};

export default function LegalPage({ markdown }) {
  const { lang } = useLang();
  return (
    <div className="w-full">
      <section className="w-full pt-28 md:pt-36 pb-8 px-6 md:px-12 lg:px-20 max-w-3xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-px bg-primary" />
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary">
            {LEGAL_LABEL[lang] || LEGAL_LABEL.nl}
          </span>
        </div>
      </section>
      <section className="w-full px-6 md:px-12 lg:px-20 pb-28 max-w-3xl">
        <ReactMarkdown components={mdComponents}>{markdown}</ReactMarkdown>
      </section>
    </div>
  );
}