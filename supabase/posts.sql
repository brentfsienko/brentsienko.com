-- Blog posts for brentsienko.com
-- Run in Supabase SQL Editor (new project or existing).

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  body text not null default '',
  draft boolean not null default true,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx
  on public.posts (published_at desc nulls last)
  where draft = false;

-- Public site uses the service role key server-side only.
-- Lock down table for anon/authenticated clients:
alter table public.posts enable row level security;

-- No policies for anon/authenticated → no direct client access.
-- Service role bypasses RLS.

-- Seed hello post (optional)
insert into public.posts (title, slug, summary, body, draft, published_at)
values (
  'hello from the sketchbook',
  'hello',
  'A new site, a new tree, a few bees.',
  E'# hello\n\nThis is the first post on **brentsienko.com**.\n\nMostly graphite. Occasional sun.',
  false,
  now()
)
on conflict (slug) do nothing;
