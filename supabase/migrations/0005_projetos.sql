-- Projetos de clientes: primeira tabela de dados do painel.
-- Só membros ativos (eh_membro) leem/escrevem; só admin apaga; anon nada.

create table public.projetos (
  id uuid primary key default gen_random_uuid(),
  nome text not null
    check (btrim(nome) <> '' and char_length(btrim(nome)) <= 120),
  cliente text not null
    check (btrim(cliente) <> '' and char_length(btrim(cliente)) <= 120),
  tipo text not null check (tipo in ('site', 'sistema', 'trafego', 'outro')),
  status text not null default 'planejado'
    check (status in ('planejado', 'em_andamento', 'em_revisao', 'pausado', 'concluido')),
  prazo date,
  responsavel_id uuid references public.membros(id) on delete set null,
  observacoes text check (char_length(observacoes) <= 2000),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index projetos_status_idx on public.projetos (status);
create index projetos_prazo_idx on public.projetos (prazo);

-- Carimbos de data controlados pelo banco: o cliente não consegue forjá-los.
-- atualizado_em é sempre now(); criado_em é now() no insert e imutável no update.
create function public.projetos_carimbar_datas() returns trigger
language plpgsql set search_path = public as $$
begin
  new.atualizado_em := now();
  if tg_op = 'INSERT' then
    new.criado_em := now();
  else
    new.criado_em := old.criado_em;
  end if;
  return new;
end;
$$;

revoke all on function public.projetos_carimbar_datas() from public, anon, authenticated;

create trigger projetos_carimbar_datas
  before insert or update on public.projetos
  for each row execute function public.projetos_carimbar_datas();

-- Defesa em duas camadas (além do padrão da 0004): o RLS não governa
-- truncate/references/trigger.
revoke truncate, references, trigger on public.projetos from anon, authenticated;
revoke all on public.projetos from anon;

alter table public.projetos enable row level security;
alter table public.projetos force row level security;

create policy projetos_select on public.projetos for select to authenticated
  using (public.eh_membro());

create policy projetos_insert on public.projetos for insert to authenticated
  with check (public.eh_membro());

create policy projetos_update on public.projetos for update to authenticated
  using (public.eh_membro()) with check (public.eh_membro());

create policy projetos_delete on public.projetos for delete to authenticated
  using (public.eh_admin());

-- Equipe para o seletor de responsável: membros ativos, só para quem é membro.
-- security definer porque o RLS de membros esconde as outras linhas.
create function public.equipe() returns table (id uuid, email text, papel text)
language sql stable security definer set search_path = public as $$
  select m.id, m.email, m.papel
  from public.membros m
  where m.ativo and public.eh_membro()
  order by m.email;
$$;

revoke all on function public.equipe() from public, anon;
grant execute on function public.equipe() to authenticated;
