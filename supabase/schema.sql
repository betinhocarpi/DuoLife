-- DuoLife Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text not null,
  age int check (age >= 18 and age <= 99),
  bio text default '',
  avatar_url text,
  photos text[] default '{}',
  location text,
  platforms text[] default '{}',
  games jsonb default '[]',
  play_style text check (play_style in ('Casual', 'Competitivo', 'Ambos')),
  gender text check (gender in ('Homem', 'Mulher', 'Não-binário', 'Prefiro não dizer')),
  looking_for text[] default '{}',
  rank text,
  discord text,
  is_premium boolean default false,
  boost_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Swipes table
create table if not exists swipes (
  id uuid primary key default uuid_generate_v4(),
  swiper_id uuid references auth.users(id) on delete cascade not null,
  swiped_id uuid references auth.users(id) on delete cascade not null,
  liked boolean not null,
  created_at timestamptz default now(),
  unique(swiper_id, swiped_id)
);

-- Matches table (created automatically via trigger)
create table if not exists matches (
  id uuid primary key default uuid_generate_v4(),
  user1_id uuid references auth.users(id) on delete cascade not null,
  user2_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

-- Messages table
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  plan text check (plan in ('basic', 'gold', 'platinum')) not null,
  status text check (status in ('active', 'cancelled', 'expired')) default 'active',
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Super likes table (premium feature)
create table if not exists super_likes (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(sender_id, receiver_id)
);

-- Function: auto-create match when mutual like
create or replace function handle_mutual_like()
returns trigger as $$
begin
  if new.liked = true then
    if exists (
      select 1 from swipes
      where swiper_id = new.swiped_id
        and swiped_id = new.swiper_id
        and liked = true
    ) then
      insert into matches (user1_id, user2_id)
      values (least(new.swiper_id, new.swiped_id), greatest(new.swiper_id, new.swiped_id))
      on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_swipe_insert
  after insert on swipes
  for each row execute procedure handle_mutual_like();

-- Function: update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- Row Level Security
alter table profiles enable row level security;
alter table swipes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table subscriptions enable row level security;

-- RLS Policies
create policy "Public profiles viewable" on profiles for select using (true);
create policy "Users manage own profile" on profiles for all using (auth.uid() = user_id);
create policy "Users manage own swipes" on swipes for all using (auth.uid() = swiper_id);
create policy "Match participants see matches" on matches for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Match participants see messages" on messages for select
  using (exists (
    select 1 from matches m
    where m.id = match_id and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
  ));
create policy "Match participants send messages" on messages for insert
  with check (
    sender_id = auth.uid() and exists (
      select 1 from matches m
      where m.id = match_id and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );
create policy "Users see own subscription" on subscriptions for select using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_swipes_swiper on swipes(swiper_id);
create index if not exists idx_swipes_swiped on swipes(swiped_id);
create index if not exists idx_matches_users on matches(user1_id, user2_id);
create index if not exists idx_messages_match on messages(match_id, created_at);
create index if not exists idx_profiles_user on profiles(user_id);
