import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useLang } from '@/lib/LangContext';

// Shared renderer for the legal pages (Privacy, Terms, Cookie policy,
// AI Disclaimer). The body is authored as Markdown and rendered faithfully,
// keeping the editorial Bogèst layout: gold "Juridisch" kicker, large heading,
// hairline-separated sections, lists and emphasis.
const LEGAL_LABEL = { nl: 'Juridisch', fr: 'Juridique', en: 'Legal' };

const mdComponents = {
  h1: ({ children }) => (
    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
      {children}<span className="text-primary">.</span>
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-lg md:text-xl font-bold text-foreground mt-10 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-base md:text-lg font-semibold text-foreground/90 mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="font-body text-base text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="font-body text-base text-muted-foreground space-y-2 ml-5 mb-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="font-body text-base text-muted-foreground space-y-2 ml-5 mb-4 list-decimal">{children}</ol>
  ),
  li: ({ children }) => <li className="list-disc">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground/90">{children}</strong>,
  em: ({ children }) => <em className="italic text-muted-foreground/80">{children}</em>,
  hr: () => <hr className="border-border/50 my-8" />,
  a: ({ children, href }) => (
    <a href={href} className="text-primary underline underline-offset-2 hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
};

export default function LegalPage({ markdown }) {
  const { lang } = useLang();
  return (
    <div className="w-full">
      <section className="w-full pt-32 md:pt-40 pb-6 px-6 md:px-10 lg:px-16">
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">
          {LEGAL_LABEL[lang] || LEGAL_LABEL.nl}
        </span>
      </section>
      <section className="w-full px-6 md:px-10 lg:px-16 pb-24 max-w-4xl">
        <ReactMarkdown components={mdComponents}>{markdown}</ReactMarkdown>
      </section>
    </div>
  );
}