-- Pegar en Supabase: SQL Editor > New query > Run
create table if not exists components (
  sku text primary key,
  name text not null,
  cat text default '',
  loc text default '',
  val text default '',
  spec text default '',
  descr text default '',
  qty integer default 0,
  min_stock integer default 0,
  updated_at timestamptz default now()
);
-- Uso personal con clave pública: RLS activado + acceso total anon
drop policy if exists "Acceso total anon (uso personal)" on components;
create policy "Acceso total anon (uso personal)"
on components for all to anon using (true) with check (true);
-- Lápidas: borrados que se propagan a todos los dispositivos
create table if not exists deleted_skus (sku text primary key, at timestamptz default now());
drop policy if exists "Acceso total anon (uso personal)" on deleted_skus;
create policy "Acceso total anon (uso personal)"
on deleted_skus for all to anon using (true) with check (true);
