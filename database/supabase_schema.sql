-- Run this in Supabase Dashboard → SQL Editor (project ftvpweyqsjdvlzwirnzk)
-- Adapted from database/schema.sql for the current app's data shapes.
-- Safe to re-run: every policy is dropped before being recreated.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Admins ────────────────────────────────────────────────
-- Created first: every other table's RLS policies reference it.
create table if not exists admins (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  created_at timestamptz default now()
);

alter table admins enable row level security;

drop policy if exists "Admins can read admin table" on admins;
create policy "Admins can read admin table"
  on admins for select using (auth.uid() = user_id);

-- ── Products ──────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  category text not null,
  stock integer not null default 0,
  sku text,
  image text,
  average_rating numeric(3,2) default 0,
  num_reviews integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table products enable row level security;

drop policy if exists "Public read products" on products;
create policy "Public read products"
  on products for select using (true);

drop policy if exists "Admins manage products" on products;
create policy "Admins manage products"
  on products for all using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- ── Orders ────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references auth.users(id) not null,
  items jsonb not null,
  shipping_address jsonb not null,
  total_amount numeric(10,2) not null,
  coupon_code text,
  status text not null default 'Pending',
  created_at timestamptz default now()
);

alter table orders enable row level security;

drop policy if exists "Customers read own orders" on orders;
create policy "Customers read own orders"
  on orders for select using (auth.uid() = customer_id);

drop policy if exists "Customers create orders" on orders;
create policy "Customers create orders"
  on orders for insert with check (auth.uid() = customer_id);

drop policy if exists "Admins read all orders" on orders;
create policy "Admins read all orders"
  on orders for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

drop policy if exists "Admins update order status" on orders;
create policy "Admins update order status"
  on orders for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- ── Reviews ───────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  customer_id uuid references auth.users(id) not null,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now(),
  unique(product_id, customer_id)
);

alter table reviews enable row level security;

drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews"
  on reviews for select using (true);

drop policy if exists "Customers write reviews" on reviews;
create policy "Customers write reviews"
  on reviews for insert with check (auth.uid() = customer_id);

drop policy if exists "Customers delete own reviews" on reviews;
create policy "Customers delete own reviews"
  on reviews for delete using (auth.uid() = customer_id);

-- ── Wishlists ─────────────────────────────────────────────
create table if not exists wishlists (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(customer_id, product_id)
);

alter table wishlists enable row level security;

drop policy if exists "Customers manage own wishlist" on wishlists;
create policy "Customers manage own wishlist"
  on wishlists for all using (auth.uid() = customer_id);

-- ── Coupons ───────────────────────────────────────────────
create table if not exists coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_percentage numeric(5,2) not null check (discount_percentage between 1 and 100),
  is_active boolean default true,
  expiry_date timestamptz,
  created_at timestamptz default now()
);

alter table coupons enable row level security;

drop policy if exists "Anyone can validate coupons" on coupons;
create policy "Anyone can validate coupons"
  on coupons for select using (true);

drop policy if exists "Admins manage coupons" on coupons;
create policy "Admins manage coupons"
  on coupons for all using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- ── Storage bucket for product images ──────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select using (bucket_id = 'product-images');
