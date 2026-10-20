-- Privilégios padrão para objetos FUTUROS do schema public.
-- O Supabase concede tudo a anon/authenticated em tabelas novas, e o RLS não
-- governa truncate/references/trigger. Aqui o padrão passa a ser mínimo.
-- Não toca objetos já existentes (0003 cuida de membros).

alter default privileges for role postgres in schema public
  revoke truncate, references, trigger on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on tables from anon;

alter default privileges for role postgres in schema public
  revoke execute on functions from anon;

-- Funções novas nascem com execute para PUBLIC (que inclui anon), e um padrão
-- restrito a um schema só ACRESCENTA ao padrão global: para tirar o PUBLIC é
-- preciso revogar no padrão global (sem "in schema"). authenticated segue com
-- o grant padrão do Supabase.
alter default privileges for role postgres
  revoke execute on functions from public;
