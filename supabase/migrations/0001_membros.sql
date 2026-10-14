-- Lista de membros autorizados do painel interno.
-- Acesso decidido por e-mail (JWT), sempre comparado em minúsculas.

create table public.membros (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  papel text not null check (papel in ('admin', 'membro')),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Unicidade também sem diferenciar caixa.
create unique index membros_email_lower_key on public.membros (lower(email));

-- security definer: consultam membros sem passar pelo RLS, evitando
-- recursão de política e resultados errados.
create function public.eh_membro() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.membros
    where lower(email) = lower(auth.jwt() ->> 'email') and ativo
  );
$$;

create function public.eh_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.membros
    where lower(email) = lower(auth.jwt() ->> 'email') and ativo and papel = 'admin'
  );
$$;

revoke all on function public.eh_membro() from public;
revoke all on function public.eh_admin() from public;
grant execute on function public.eh_membro() to authenticated;
grant execute on function public.eh_admin() to authenticated;

alter table public.membros enable row level security;
alter table public.membros force row level security;

create policy membros_select on public.membros for select to authenticated
  using (
    public.eh_admin()
    or (ativo and lower(email) = lower(auth.jwt() ->> 'email'))
  );

create policy membros_insert on public.membros for insert to authenticated
  with check (public.eh_admin());

create policy membros_update on public.membros for update to authenticated
  using (public.eh_admin()) with check (public.eh_admin());

create policy membros_delete on public.membros for delete to authenticated
  using (public.eh_admin());
