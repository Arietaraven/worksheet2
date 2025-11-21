-- Enable uuid helpers (enabled by default on Supabase, but harmless if rerun)
create extension if not exists "pgcrypto";

-- Activity 1 · Todos
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists todos_user_id_idx on public.todos (user_id);

-- Activity 2 · Drive Lite photos
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  image_url text,
  created_at timestamptz not null default now()
);
create index if not exists photos_user_id_idx on public.photos (user_id);
create index if not exists photos_name_idx on public.photos using gin (to_tsvector('english', name));

-- Activity 3 · Food photos + reviews
create table if not exists public.food_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  image_url text,
  created_at timestamptz not null default now()
);
create index if not exists food_photos_user_id_idx on public.food_photos (user_id);

create table if not exists public.food_reviews (
  id uuid primary key default gen_random_uuid(),
  food_id uuid references public.food_photos on delete cascade,
  user_id uuid references auth.users not null,
  rating int not null check (rating between 1 and 5),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists food_reviews_food_id_idx on public.food_reviews (food_id);
create index if not exists food_reviews_user_id_idx on public.food_reviews (user_id);

-- Activity 4 · Pokémon reviews
create table if not exists public.pokemon_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  pokemon_name text not null,
  title text not null,
  content text not null,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);
create index if not exists pokemon_reviews_user_id_idx on public.pokemon_reviews (user_id);
create index if not exists pokemon_reviews_pokemon_idx on public.pokemon_reviews (pokemon_name);

-- Activity 5 · Markdown notes
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists notes_user_id_idx on public.notes (user_id);

