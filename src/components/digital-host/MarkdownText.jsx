import ReactMarkdown from 'react-markdown';

// Markdown renderer tuned for the Digital Host chat bubbles. Supports
// **bold**, *italic*, links, lists, headings, quotes — so the host's replies
// render with proper emphasis instead of plain text. Single newlines are
// preserved as hard line breaks so conversational formatting stays intact.
export default function MarkdownText({ content, isDark }) {
  if (!content) return null;
  // Convert single newlines (not part of a blank-line paragraph break) into
  // Markdown hard breaks so line spacing survives parsing.
  const md = String(content).replace(/(?<!\n)\n(?!\n)/g, '  \n');
  const color = isDark ? 'rgba(255,255,255,0.92)' : 'hsl(var(--foreground))';
  const strongColor = isDark ? 'rgba(255,235,150,0.95)' : 'hsl(78 40% 24%)';
  return (
    <div className="font-body text-sm leading-relaxed" style={{ color }}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold" style={{ color: strongColor }}>{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">{children}</a>
          ),
          h1: ({ children }) => <h3 className="font-heading text-base font-semibold mb-1.5 mt-1">{children}</h3>,
          h2: ({ children }) => <h3 className="font-heading text-sm font-semibold mb-1.5 mt-1">{children}</h3>,
          h3: ({ children }) => <h3 className="font-heading text-sm font-semibold mb-1 mt-0.5">{children}</h3>,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/40 pl-3 italic opacity-90 mb-1.5">{children}</blockquote>,
          code: ({ children }) => <code className="px-1 py-0.5 rounded text-[12px]" style={{ background: 'rgba(255,255,255,0.10)' }}>{children}</code>,
          hr: () => <hr className="my-2 border-white/15" />,
        }}
      >{md}</ReactMarkdown>
    </div>
  );
}