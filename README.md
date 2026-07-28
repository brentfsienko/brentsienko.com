# brentsienko.com

Personal site — trees, bees, and a password-gated blog editor.

**Live domain (planned):** [https://brentsienko.com](https://brentsienko.com)

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- JetBrains Mono
- Supabase Postgres for blog posts
- Shared-password admin at `/blog/write`

## Local development

```bash
cp .env.example .env.local
# fill in Supabase + blog password/secret
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Blog database

1. Create a Supabase project (or reuse one).
2. SQL Editor → run [`supabase/posts.sql`](./supabase/posts.sql).
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose to the browser).

Set `BLOG_ADMIN_PASSWORD` and a long `BLOG_SESSION_SECRET` (`openssl rand -base64 32`).

Post at `/blog/write` (not linked in the public nav).

## Deploy on Vercel

1. Push this repo to GitHub (`brentfsienko/...`).
2. Import the project in Vercel.
3. Add env vars from `.env.example`.
4. Deploy.

### Custom domain `brentsienko.com`

After purchase, in Vercel → Project → Settings → Domains:

1. Add `brentsienko.com` and `www.brentsienko.com`.
2. At your registrar, set the DNS records Vercel shows (usually):
   - **A** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`
3. Wait for SSL; prefer apex `brentsienko.com` and redirect `www` → apex (or the reverse).

## Routes

| Path | Notes |
|------|--------|
| `/` | Hero |
| `/work` | Sudoku + Benchmark |
| `/about` | Bio + resume PDF |
| `/blog` | Published posts |
| `/blog/write` | Password gate + editor |

Resume: [`public/BrentSienkoResume.pdf`](./public/BrentSienkoResume.pdf)
