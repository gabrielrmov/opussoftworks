-- Guardas: nunca zerar os admins, bloquear cadastro de quem não é membro,
-- e endurecer permissões/normalização da tabela membros.

-- Supabase concede execute em funções direto ao anon; revogar de public não basta.
revoke execute on function public.eh_membro(), public.eh_admin() from anon;

-- E-mail sempre gravado já normalizado (a comparação por lower() depende disso).
alter table public.membros
  add constraint membros_email_normalizado check (email = lower(btrim(email)));

-- Depois de qualquer update/delete (nível de linha, mas executado ao fim do
-- comando), exige ao menos um admin ativo. AFTER vê o resultado do comando
-- inteiro, então também pega um único update que atinge vários admins.
-- security definer: a contagem ignora o RLS de quem chama.
create function public.membros_preservar_ultimo_admin() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.papel = 'admin' and old.ativo
     and not exists (select 1 from public.membros where papel = 'admin' and ativo) then
    raise exception 'Operacao negada: nao pode ficar sem ultimo admin ativo'
      using errcode = 'check_violation';
  end if;
  return null;
end;
$$;

revoke all on function public.membros_preservar_ultimo_admin() from public, anon, authenticated;

create trigger membros_preservar_ultimo_admin
  after update or delete on public.membros
  for each row execute function public.membros_preservar_ultimo_admin();

-- Hook "Before User Created" do Supabase Auth: só e-mails ativos em membros.
create function public.hook_bloquear_cadastro(event jsonb) returns jsonb
language sql stable security definer set search_path = public as $$
  select case
    when exists (
      select 1 from public.membros
      where ativo and lower(email) = lower(btrim(event -> 'user' ->> 'email'))
    ) then '{}'::jsonb
    else '{"error":{"message":"Acesso restrito.","http_code":403}}'::jsonb
  end;
$$;

revoke all on function public.hook_bloquear_cadastro(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_bloquear_cadastro(jsonb) to supabase_auth_admin;
