-- CuanRadar — 0001_init.sql (BUILD 1)
-- Schema inti per PRD §59 & ARCHITECTURE §3. Jalankan di Supabase SQL Editor.
-- Prinsip: uang = integer minor unit (sen IDR); tiga sumbu status terpisah; RLS aktif.

-- ============ ENUM ============
create type public.risk_level as enum ('rendah','sedang','tinggi','terindikasi_scam');
create type public.verification_status as enum ('verified','partially_verified','unverified');
create type public.offer_status as enum ('active','expired','scheduled');
create type public.category as enum ('entertainment','shopping','wallet','lainnya');
create type public.catalog_status as enum ('mvp','fase2','pantau');
create type public.reward_type as enum ('saldo','cashback','poin','koin','voucher','miles','promo','komisi','bunga','task');
create type public.payout_method as enum ('dana','ovo','gopay','shopeepay','linkaja','bank','bank_transfer','voucher','saldo_app','potongan_transaksi');
create type public.scan_type as enum ('quick','deep');
create type public.scan_state as enum ('queued','checking_cache','discovering','filtering','extracting','verifying','calculating','ranking','completed','cache_completed','limited','failed');
create type public.moderation_status as enum ('baru','terverifikasi','ditolak');
create type public.source_priority as enum ('official','official_store','trusted_external','community','unknown');

-- ============ KATALOG (baca publik) ============
create table public.reward_apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category public.category not null,
  developer text,
  website text,
  google_play text,
  app_store text,
  country text not null default 'ID',
  status public.catalog_status not null default 'fase2',
  reward_types public.reward_type[] not null default '{}',
  payout_methods public.payout_method[] not null default '{}',
  min_payout_idr bigint, -- sen IDR
  risk_level public.risk_level not null default 'sedang',
  verification_status public.verification_status not null default 'unverified',
  notes text,
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reward_apps_category_idx on public.reward_apps(category);
create index reward_apps_status_idx on public.reward_apps(status);

create table public.reward_offers (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.reward_apps(id) on delete cascade,
  title text not null,
  description text,
  reward_type public.reward_type not null,
  reward_value bigint, -- sen IDR
  reward_unit text,
  currency text not null default 'IDR',
  activity text,
  conditions text[] not null default '{}',
  min_activity bigint,
  max_reward bigint,
  min_withdrawal bigint,
  validity timestamptz,
  estimated_menit integer,
  referral_url text,
  source text not null default 'manual', -- manual | community | auto
  provenance text not null default 'database', -- database | cache | search_new
  offer_status public.offer_status not null default 'active',
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reward_offers_platform_idx on public.reward_offers(platform_id);
create index reward_offers_status_idx on public.reward_offers(offer_status);

create table public.reward_sources (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.reward_offers(id) on delete cascade,
  platform_id uuid references public.reward_apps(id) on delete cascade,
  priority public.source_priority not null default 'unknown',
  url text not null,
  snapshot_at timestamptz not null default now(),
  constraint reward_sources_target check (offer_id is not null or platform_id is not null)
);

create table public.verification_records (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid references public.reward_apps(id) on delete cascade,
  offer_id uuid references public.reward_offers(id) on delete cascade,
  field_verified text not null,
  method text not null,
  evidence_ref text,
  reviewer text,
  verified_at timestamptz not null default now()
);

create table public.reward_history (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.reward_apps(id) on delete cascade,
  offer_id uuid references public.reward_offers(id) on delete cascade,
  period_start date not null,
  period_end date,
  value_nominal bigint,
  value_percent numeric(5,2),
  note text,
  recorded_at timestamptz not null default now()
);

-- ============ LAPORAN KOMUNITAS (bukti payout & keluhan) ============
create table public.payout_reports (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.reward_apps(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  amount_idr bigint not null,
  paid_at date,
  method public.payout_method,
  evidence_ref text,
  status public.moderation_status not null default 'baru',
  confirmations integer not null default 0,
  created_at timestamptz not null default now()
);
create index payout_reports_platform_idx on public.payout_reports(platform_id);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.reward_apps(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  report_type text not null, -- telat_bayar | ubah_syarat | indikasi_scam | lainnya
  description text,
  status public.moderation_status not null default 'baru',
  confirmations integer not null default 0,
  created_at timestamptz not null default now()
);
create index community_reports_platform_idx on public.community_reports(platform_id);

-- ============ REVIEW QUEUE (hasil AI menunggu tinjauan — deny by default) ============
create table public.review_queue_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- app | offer
  payload jsonb not null,
  status public.moderation_status not null default 'baru',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============ DATA PENGGUNA ============
create table public.scan_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  scan_type public.scan_type not null,
  category public.category,
  state public.scan_state not null default 'queued',
  credits_used integer not null default 1,
  cost_llm_usd numeric(8,6) not null default 0,
  cost_search_usd numeric(8,6) not null default 0,
  cache_hit boolean not null default false,
  candidates integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index scan_history_user_idx on public.scan_history(user_id);

create table public.scan_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',
  quick_used_today integer not null default 0,
  deep_used_today integer not null default 0,
  usage_date date not null default current_date,
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_categories public.category[] not null default '{}',
  preferred_payout public.payout_method[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_saved_apps (
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id uuid not null references public.reward_apps(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, platform_id)
);

-- ============ RLS ============
-- Katalog & verifikasi: baca publik; tulis hanya via service role / edge function (deny by default).
alter table public.reward_apps enable row level security;
alter table public.reward_offers enable row level security;
alter table public.reward_sources enable row level security;
alter table public.verification_records enable row level security;
alter table public.reward_history enable row level security;

create policy "katalog baca publik" on public.reward_apps for select using (true);
create policy "offer baca publik" on public.reward_offers for select using (true);
create policy "sumber baca publik" on public.reward_sources for select using (true);
create policy "verifikasi baca publik" on public.verification_records for select using (true);
create policy "history baca publik" on public.reward_history for select using (true);

-- Data pengguna: pemilik saja.
alter table public.user_preferences enable row level security;
alter table public.user_saved_apps enable row level security;
alter table public.scan_history enable row level security;
alter table public.scan_credits enable row level security;

create policy "preferensi pemilik" on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saved pemilik" on public.user_saved_apps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "scan history pemilik" on public.scan_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "scan credits pemilik" on public.scan_credits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Laporan komunitas: baca publik (anonim); insert terautentikasi; moderasi via service role.
alter table public.payout_reports enable row level security;
alter table public.community_reports enable row level security;

create policy "payout baca publik" on public.payout_reports for select using (true);
create policy "payout insert terautentikasi" on public.payout_reports for insert with check (auth.uid() is not null);
create policy "community baca publik" on public.community_reports for select using (true);
create policy "community insert terautentikasi" on public.community_reports for insert with check (auth.uid() is not null);

-- Review queue: TANPA policy publik → deny by default; hanya service role / edge function (PRD Appendix A6).
alter table public.review_queue_items enable row level security;
