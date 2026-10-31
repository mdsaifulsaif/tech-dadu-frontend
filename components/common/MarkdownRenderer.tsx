"use client";

import React from "react";

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content = "",
  className = "",
}) => {
  if (!content) return null;

  // If content contains HTML tags from WYSIWYG editor, render as formatted HTML
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className={`rich-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Split content into blocks by double newlines
  const blocks = content.split(/\n\n+/);

  return (
    <div className={`rich-content space-y-4 ${className}`}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 1
        if (trimmed.startsWith("# ")) {
          return (
            <h2
              key={idx}
              className="text-xl sm:text-2xl font-black text-theme-fg pt-4 pb-2 border-b border-theme-border/60"
            >
              {trimmed.replace("# ", "")}
            </h2>
          );
        }

        // Heading 2
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={idx}
              className="text-lg sm:text-xl font-extrabold text-theme-primary pt-3 pb-1 border-b border-theme-border/40"
            >
              {trimmed.replace("## ", "")}
            </h3>
          );
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-base font-bold text-theme-fg pt-2">
              {trimmed.replace("### ", "")}
            </h4>
          );
        }

        // Unordered list (- or *)
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 my-2">
              {items.map((item, i) => (
                <li key={i} className="text-theme-fg/90 leading-relaxed">
                  {renderInlineMarkdown(item.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list (1. 2. 3.)
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ol key={idx} className="list-decimal list-inside space-y-1.5 pl-2 my-2">
              {items.map((item, i) => (
                <li key={i} className="text-theme-fg/90 leading-relaxed">
                  {renderInlineMarkdown(item.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // Blockquote (> )
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-theme-primary pl-4 py-2 italic text-theme-muted bg-theme-primary/5 rounded-r-lg my-2"
            >
              {renderInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
            </blockquote>
          );
        }

        // Code block (```)
        if (trimmed.startsWith("```")) {
          const cleanCode = trimmed.replace(/```[a-z]*\n?/g, "").replace(/```$/, "");
          return (
            <pre
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs overflow-x-auto text-theme-primary my-2"
            >
              <code>{cleanCode}</code>
            </pre>
          );
        }

        // Image (![alt](url))
        if (trimmed.startsWith("![")) {
          const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <figure key={idx} className="my-4 rounded-xl overflow-hidden border border-theme-border bg-theme-bg">
                <img
                  src={match[2]}
                  alt={match[1]}
                  className="w-full max-h-96 object-contain mx-auto"
                  loading="lazy"
                />
                {match[1] && (
                  <figcaption className="text-center text-[11px] text-theme-muted py-2 bg-theme-surface border-t border-theme-border">
                    {match[1]}
                  </figcaption>
                )}
              </figure>
            );
          }
        }

        // Regular paragraph with inline markdown parsing
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to parse bold, italic, inline code, and links
function renderInlineMarkdown(text: string): React.ReactNode {
  // Regex to match:
  // 1. [text](url)
  // 2. **bold**
  // 3. *italic*
  // 4. `code`
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // Link [Title](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-primary underline font-semibold hover:text-theme-primary-hover inline-flex items-center gap-0.5"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Bold **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-theme-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic *text*
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-theme-fg">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline code `code`
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-theme-bg border border-theme-border font-mono text-[11px] text-theme-primary font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}
