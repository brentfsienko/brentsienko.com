export type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  draft: boolean;
  published_at: string | null;
  updated_at: string;
};

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

const PREFIX = "blog/posts/";

export function postPathname(slug: string) {
  return `${PREFIX}${slug}.json`;
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** The first photo in a post's markdown body, used as its thumbnail on the blog list. */
export function firstPhoto(body: string): { url: string; alt: string } | null {
  const re = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body))) {
    const url = match[2] ?? "";
    if (url.startsWith("https://") || url.startsWith("/api/blog/photo/")) {
      return { url, alt: match[1] ?? "" };
    }
  }
  return null;
}
