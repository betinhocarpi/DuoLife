-- DuoLife Games Catalog
-- Top 50 most played games worldwide

create table if not exists games (
  id text primary key,
  name text not null,
  category text not null,
  icon text not null,
  cover_url text,
  rank int,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table games enable row level security;
create policy "Games are public" on games for select using (true);

-- Insert top 50 games (ranked by global player base)
insert into games (id, name, category, icon, cover_url, rank) values
  ('minecraft',    'Minecraft',                  'Sandbox',          '⛏️',  'https://cdn.cloudflare.steamstatic.com/steam/apps/2566420/header.jpg', 1),
  ('roblox',       'Roblox',                     'Plataforma',       '🟥',  'https://static-cdn.jtvnw.net/ttv-boxart/Roblox-285x380.jpg', 2),
  ('fortnite',     'Fortnite',                   'Battle Royale',    '🏗️',  'https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg', 3),
  ('honor_kings',  'Honor of Kings',             'MOBA Mobile',      '👑',  'https://static-cdn.jtvnw.net/ttv-boxart/Honor%20of%20Kings-285x380.jpg', 4),
  ('pubg_mobile',  'PUBG Mobile',                'Battle Royale',    '🎯',  'https://static-cdn.jtvnw.net/ttv-boxart/PUBG%20Mobile-285x380.jpg', 5),
  ('freefire',     'Free Fire',                  'Battle Royale',    '🔥',  'https://static-cdn.jtvnw.net/ttv-boxart/Free%20Fire-285x380.jpg', 6),
  ('mlbb',         'Mobile Legends: Bang Bang',  'MOBA Mobile',      '📱',  'https://static-cdn.jtvnw.net/ttv-boxart/Mobile%20Legends%3A%20Bang%20Bang-285x380.jpg', 7),
  ('gtav',         'GTA Online',                 'Open World',       '🚗',  'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg', 8),
  ('lol',          'League of Legends',          'MOBA',             '⚔️',  'https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg', 9),
  ('pokemon_go',   'Pokémon GO',                 'AR Mobile',        '🎮',  'https://static-cdn.jtvnw.net/ttv-boxart/Pok%C3%A9mon%20GO-285x380.jpg', 10),
  ('clash_clans',  'Clash of Clans',             'Strategy Mobile',  '🏰',  'https://static-cdn.jtvnw.net/ttv-boxart/Clash%20of%20Clans-285x380.jpg', 11),
  ('candy_crush',  'Candy Crush Saga',           'Casual Mobile',    '🍬',  'https://static-cdn.jtvnw.net/ttv-boxart/Candy%20Crush%20Saga-285x380.jpg', 12),
  ('genshin',      'Genshin Impact',             'RPG',              '🌸',  'https://static-cdn.jtvnw.net/ttv-boxart/Genshin%20Impact-285x380.jpg', 13),
  ('valorant',     'Valorant',                   'FPS',              '🔫',  'https://static-cdn.jtvnw.net/ttv-boxart/Valorant-285x380.jpg', 14),
  ('cs2',          'CS2',                        'FPS',              '💣',  'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg', 15),
  ('warzone',      'Call of Duty: Warzone',      'Battle Royale',    '🪖',  'https://static-cdn.jtvnw.net/ttv-boxart/Warzone-285x380.jpg', 16),
  ('pubg',         'PUBG: Battlegrounds',        'Battle Royale',    '🎪',  'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg', 17),
  ('dota2',        'Dota 2',                     'MOBA',             '🗡️',  'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', 18),
  ('apex',         'Apex Legends',               'Battle Royale',    '🎯',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg', 19),
  ('brawl_stars',  'Brawl Stars',                'Ação Mobile',      '⭐',  'https://static-cdn.jtvnw.net/ttv-boxart/Brawl%20Stars-285x380.jpg', 20),
  ('ow2',          'Overwatch 2',                'FPS',              '🦸',  'https://static-cdn.jtvnw.net/ttv-boxart/Overwatch%202-285x380.jpg', 21),
  ('clash_royale', 'Clash Royale',               'Strategy Mobile',  '🃏',  'https://static-cdn.jtvnw.net/ttv-boxart/Clash%20Royale-285x380.jpg', 22),
  ('wow',          'World of Warcraft',          'MMO',              '🧙',  'https://static-cdn.jtvnw.net/ttv-boxart/World%20of%20Warcraft-285x380.jpg', 23),
  ('r6',           'Rainbow Six Siege',          'FPS',              '🛡️',  'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg', 24),
  ('ffxiv',        'Final Fantasy XIV',          'MMO',              '🌟',  'https://static-cdn.jtvnw.net/ttv-boxart/Final%20Fantasy%20XIV%20Online-285x380.jpg', 25),
  ('rocket',       'Rocket League',              'Sports',           '🚀',  'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg', 26),
  ('eafc',         'EA FC 25',                   'Sports',           '⚽',  'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/header.jpg', 27),
  ('hearthstone',  'Hearthstone',                'Card Game',        '🃏',  'https://static-cdn.jtvnw.net/ttv-boxart/Hearthstone-285x380.jpg', 28),
  ('tft',          'Teamfight Tactics',          'Auto Battler',     '♟️',  'https://static-cdn.jtvnw.net/ttv-boxart/Teamfight%20Tactics-285x380.jpg', 29),
  ('cod_mobile',   'Call of Duty: Mobile',       'FPS Mobile',       '📲',  'https://static-cdn.jtvnw.net/ttv-boxart/Call%20of%20Duty%3A%20Mobile-285x380.jpg', 30),
  ('diablo4',      'Diablo IV',                  'RPG',              '😈',  'https://static-cdn.jtvnw.net/ttv-boxart/Diablo%20IV-285x380.jpg', 31),
  ('elden_ring',   'Elden Ring',                 'Action RPG',       '💍',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', 32),
  ('destiny2',     'Destiny 2',                  'FPS/RPG',          '🌌',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg', 33),
  ('lost_ark',     'Lost Ark',                   'MMO',              '⚓',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg', 34),
  ('poe2',         'Path of Exile 2',            'RPG',              '💀',  'https://cdn.cloudflare.steamstatic.com/steam/apps/2694490/header.jpg', 35),
  ('dbd',          'Dead by Daylight',           'Horror',           '🔪',  'https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg', 36),
  ('stardew',      'Stardew Valley',             'Simulation',       '🌾',  'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg', 37),
  ('among',        'Among Us',                   'Social',           '🚀',  'https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg', 38),
  ('terraria',     'Terraria',                   'Sandbox',          '🌲',  'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg', 39),
  ('sims4',        'The Sims 4',                 'Simulation',       '🏠',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/header.jpg', 40),
  ('fall_guys',    'Fall Guys',                  'Battle Royale',    '🫘',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg', 41),
  ('rust',         'Rust',                       'Survival',         '🔨',  'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg', 42),
  ('warframe',     'Warframe',                   'FPS/RPG',          '🤖',  'https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg', 43),
  ('war_thunder',  'War Thunder',                'Action',           '✈️',  'https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg', 44),
  ('mhwilds',      'Monster Hunter Wilds',       'Action RPG',       '🐉',  'https://cdn.cloudflare.steamstatic.com/steam/apps/2246340/header.jpg', 45),
  ('palworld',     'Palworld',                   'Survival',         '🦄',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg', 46),
  ('helldivers2',  'Helldivers 2',               'TPS',              '🪖',  'https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg', 47),
  ('tarkov',       'Escape from Tarkov',         'FPS',              '🎒',  'https://static-cdn.jtvnw.net/ttv-boxart/Escape%20From%20Tarkov-285x380.jpg', 48),
  ('hades2',       'Hades II',                   'Roguelike',        '🔱',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1450540/header.jpg', 49),
  ('new_world',    'New World: Aeternum',        'MMO',              '⚓',  'https://cdn.cloudflare.steamstatic.com/steam/apps/1063730/header.jpg', 50)
on conflict (id) do update set
  cover_url = excluded.cover_url,
  rank = excluded.rank;
