import React from 'react';

// Shared renderer for the legal pages (Privacy, Terms, Cookie policy,
// AI Disclaimer). Keeps the editorial layout identical across documents.
export default function LegalPage({ content }) {
  return (
    <div className="w-full">
      <section className="w-full pt-32 md:pt-40 pb-12 px-6 md:px-10 lg:px-16">
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">Juridisch</span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">{content.title}</h1>
        {content.intro && (
          <p className="font-body text-base text-muted-foreground leading-relaxed mt-6 max-w-3xl">{content.intro}</p>
        )}
        {content.updated && (
          <p className="font-body text-xs text-muted-foreground/70 mt-4">{content.updated}</p>
        )}
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24 max-w-4xl">
        <div className="space-y-8">
          {content.sections.map((section) => (
            <div key={section.num} className="space-y-3">
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                {section.num}. {section.title}
              </h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">{section.content}</p>
              {section.list && (
                <ul className="font-body text-base text-muted-foreground space-y-2 ml-4">
                  {section.list.map((item, i) => (<li key={i} className="list-disc">{item}</li>))}
                </ul>
              )}
              {section.list2title && (
                <>
                  <p className="font-body text-base text-muted-foreground leading-relaxed mt-3">{section.list2title}</p>
                  <ul className="font-body text-base text-muted-foreground space-y-2 ml-4">
                    {section.list2.map((item, i) => (<li key={i} className="list-disc">{item}</li>))}
                  </ul>
                </>
              )}
              {section.content2 && (
                <p className="font-body text-base text-muted-foreground leading-relaxed mt-3">{section.content2}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}