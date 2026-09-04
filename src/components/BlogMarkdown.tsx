import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdown({
  body,
  empty,
}: {
  body: string;
  empty?: string;
}) {
  if (!body.trim()) {
    return empty ? (
      <p className="text-sm text-ink-soft">{empty}</p>
    ) : null;
  }

  return (
    <div className="prose-sketch">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt ?? ""} className="blog-photo" />
            ) : null,
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
