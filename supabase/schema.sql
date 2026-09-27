-- Hornito: schema de la base de datos (demo con un negocio de ejemplo: Panadería Doña Rosa)
-- Ejecutar en el SQL editor de Supabase.

create extension if not exists "pgcrypto";

-- Productos del catálogo
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category text not null default 'panaderia', -- panaderia | pasteleria | cafeteria
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pedidos anticipados
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity,
  customer_name text not null,
  customer_phone text not null,
  pickup_date date not null,
  pickup_time text not null, -- ej: '09:00-11:00'
  status text not null default 'pending', -- pending | confirmed | ready | delivered | cancelled
  notes text,
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Items de cada pedido
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

create index if not exists order_items_order_id_idx on order_items(order_id);

-- Row Level Security
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Cualquiera puede leer el catálogo público de productos activos
drop policy if exists "public read active products" on products;
create policy "public read active products"
  on products for select
  using (active = true);

-- orders / order_items no tienen policies para el rol anon:
-- solo se crean y leen desde el server (service role key) en /api/chat,
-- así el catálogo es público pero los pedidos no son manipulables desde el browser.

-- Seed: catálogo inicial de Panadería Doña Rosa
insert into products (name, description, price, category, image_url) values
  ('Medialunas de manteca (x6)', 'Clásicas medialunas argentinas, tiernas y recién horneadas', 3200, 'panaderia', null),
  ('Pan de campo', 'Pan artesanal de masa madre, hornea todos los días', 2800, 'panaderia', null),
  ('Facturas surtidas (x12)', 'Mix de vigilantes, cañoncitos y sacramentos', 6500, 'panaderia', null),
  ('Torta de chocolate (porción)', 'Bizcochuelo húmedo con ganache de chocolate', 2900, 'pasteleria', null),
  ('Cheesecake de frutos rojos (porción)', 'Base de galletita, cremoso y coulis de frutos rojos', 3400, 'pasteleria', null),
  ('Café con leche', 'Café de especialidad con leche vaporizada', 2200, 'cafeteria', null),
  ('Alfajor de maicena (x2)', 'Rellenos de dulce de leche y coco rallado', 2100, 'panaderia', null)
on conflict do nothing;
