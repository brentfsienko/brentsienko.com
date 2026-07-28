import { cookies } from "next/headers";
import {
  BLOG_COOKIE,
  verifySessionToken,
} from "@/lib/blog-session";

export {
  BLOG_COOKIE,
  MAX_AGE_SECONDS,
  checkAdminPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/blog-session";

export async function isBlogAuthed() {
  const jar = await cookies();
  return verifySessionToken(jar.get(BLOG_COOKIE)?.value);
}
