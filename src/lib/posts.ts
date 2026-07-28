import { del, get, list, put } from "@vercel/blob";
import {
  isBlobConfigured,
  postPathname,
  slugify,
  type Post,
} from "./post-types";

export type { Post } from "./post-types";
export { isBlobConfigured, slugify, postPathname } from "./post-types";

async function readPostFromPath(pathname: string): Promise<Post | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as Post;
}

async function listAllPostBlobs() {
  const blobs: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "blog/posts/", cursor });
    for (const blob of page.blobs) {
      if (blob.pathname.endsWith(".json")) {
        blobs.push({ pathname: blob.pathname, url: blob.url });
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function loadAllPosts(): Promise<Post[]> {
  if (!isBlobConfigured()) return [];
  const blobs = await listAllPostBlobs();
  const posts = await Promise.all(
    blobs.map(async (blob) => {
      try {
        return await readPostFromPath(blob.pathname);
      } catch {
        return null;
      }
    }),
  );
  return posts.filter((p): p is Post => p !== null);
}

export async function listPublishedPosts(): Promise<Post[]> {
  const posts = await loadAllPosts();
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => {
      const da = a.published_at ?? a.updated_at;
      const db = b.published_at ?? b.updated_at;
      return db.localeCompare(da);
    });
}

export async function listAllPosts(): Promise<Post[]> {
  const posts = await loadAllPosts();
  return posts.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  if (!isBlobConfigured()) return null;
  const post = await readPostFromPath(postPathname(slug));
  if (!post || post.draft) return null;
  return post;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isBlobConfigured()) return null;
  return readPostFromPath(postPathname(slug));
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await loadAllPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export async function savePost(post: Post, previousSlug?: string | null) {
  if (!isBlobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }

  if (previousSlug && previousSlug !== post.slug) {
    await del(postPathname(previousSlug));
  }

  await put(postPathname(post.slug), JSON.stringify(post, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function deletePost(slug: string) {
  if (!isBlobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  await del(postPathname(slug));
}
