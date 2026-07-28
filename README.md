# brentsienko.com

Personal site — trees, bees, and a password-gated blog editor.

**Live:** [https://brentsienko-com.vercel.app](https://brentsienko-com.vercel.app) · domain planned: [https://brentsienko.com](https://brentsienko.com)

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- JetBrains Mono
- **Vercel Blob** for blog posts (private JSON blobs)
- Shared-password admin at `/blog/write`

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Blog storage (Vercel Blob)

1. In the [Vercel dashboard](https://vercel.com/dashboard) → your project → **Storage** → create a **Blob** store (or run `vercel blob create-store` from this repo).
2. Connect it to the project — Vercel sets `BLOB_READ_WRITE_TOKEN`.
3. Pull env locally: `vercel env pull .env.local`
4. Also set:
   - `BLOG_ADMIN_PASSWORD` — unlocks `/blog/write`
   - `BLOG_SESSION_SECRET` — e.g. `openssl rand -base64 32`

Posts are stored as private blobs at `blog/posts/{slug}.json`.

## Deploy

Already linked to Vercel as `brentsienko-com`. Push to `main` or:

```bash
vercel deploy --prod
```

### Custom domain `brentsienko.com`

Vercel → Project → Settings → Domains → add apex + `www`, then at your registrar:

- **A** `@` → `76.76.21.21`
- **CNAME** `www` → `cname.vercel-dns.com`

## Routes

| Path | Notes |
|------|--------|
| `/` | Hero |
| `/work` | Sudoku + Benchmark |
| `/about` | Bio + resume PDF |
| `/blog` | Published posts |
| `/blog/write` | Password gate + editor |

Resume: [`public/BrentSienkoResume.pdf`](./public/BrentSienkoResume.pdf)
