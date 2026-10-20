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

-- Atenção: o padrão acima só tira o grant DIRETO de anon. Por padrão do Postgres,
-- funções novas ainda nascem com execute para PUBLIC (que inclui anon). Revogar
-- isso globalmente afetaria extensões e outros schemas, então toda função nova
-- deve fazer `revoke execute ... from public, anon` explicitamente (como a 0005).
