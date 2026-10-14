-- Privilégios mínimos em membros: o RLS não governa truncate/references/trigger.
revoke truncate, references, trigger on public.membros from anon, authenticated;
revoke all on public.membros from anon;
