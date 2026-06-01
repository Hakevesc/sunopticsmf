-- Popup ads table
create table if not exists popups (
  id              uuid primary key default gen_random_uuid(),
  title           text,
  subtitle        text,
  description     text,
  has_offer       boolean not null default false,
  offer_text      text,
  has_countdown   boolean not null default false,
  countdown_end   timestamptz,
  cta_text        text,
  cta_url         text,
  has_input       boolean not null default false,
  input_type      text not null default 'email',
  input_placeholder text,
  image_url       text,
  design_theme    integer not null default 1,
  pages           text[] not null default '{home}',
  trigger_type    text not null default 'delay',
  trigger_delay   integer not null default 3,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Disable RLS so the anon/publishable key can read and write (same pattern as other tables in this project)
alter table popups disable row level security;
