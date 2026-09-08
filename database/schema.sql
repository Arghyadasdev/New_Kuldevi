-- Run this in Supabase Dashboard → SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Products ──────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  stock integer not null default 0,
  sku text unique,
  image text,
  average_rating numeric(3,2) default 0,
  num_reviews integer default 0,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public read products"
  on products for select using (true);

create policy "Admins manage products"
  on products for all using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- ── Admins ────────────────────────────────────────────────
create table if not exists admins (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  created_at timestamptz default now()
);

alter table admins enable row level security;

create policy "Admins can read admin table"
  on admins for select using (auth.uid() = user_id);

-- ── Orders ────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references auth.users(id),
  items jsonb not null,
  shipping_address jsonb not null,
  total_amount numeric(10,2) not null,
  coupon_code text,
  status text not null default 'Pending',
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Customers read own orders"
  on orders for select using (auth.uid() = customer_id);

create policy "Customers create orders"
  on orders for insert with check (auth.uid() = customer_id);

create policy "Admins read all orders"
  on orders for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admins update order status"
  on orders for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- ── Reviews ───────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  customer_id uuid references auth.users(id) not null,
  customer_name text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique(product_id, customer_id)
);

alter table reviews enable row level security;

create policy "Public read reviews"
  on reviews for select using (true);

create policy "Customers write reviews"
  on reviews for insert with check (auth.uid() = customer_id);

-- ── Wishlists ─────────────────────────────────────────────
create table if not exists wishlists (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(customer_id, product_id)
);

alter table wishlists enable row level security;

create policy "Customers manage own wishlist"
  on wishlists for all using (auth.uid() = customer_id);

-- ── Coupons ───────────────────────────────────────────────
create table if not exists coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text not null default 'percentage',
  discount_value numeric(10,2) not null,
  active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table coupons enable row level security;

create policy "Anyone can validate coupons"
  on coupons for select using (true);

create policy "Admins manage coupons"
  on coupons for all using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- ── Supabase Storage bucket for product images ─────────────
-- Run in Storage tab: create bucket named 'product-images' (public)
-- Or run:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
