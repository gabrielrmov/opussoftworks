-- EXEMPLO de seed dos administradores do painel.
--
-- ATENÇÃO: o arquivo real (supabase/seed.sql, com e-mails de verdade) NUNCA
-- deve ser commitado. O repositório é público. Ele está no .gitignore.
-- Copie este arquivo, troque os e-mails e rode no SQL Editor do Supabase
-- (como postgres), ANTES de ativar o hook e ANTES do primeiro login.
--
-- Normalização: a tabela exige email = lower(btrim(email)) (constraint
-- membros_email_normalizado). Use sempre minúsculas e sem espaços nas pontas,
-- senão o insert falha.

insert into public.membros (email, papel, ativo) values
  ('fundador1@exemplo.test', 'admin', true),
  ('fundador2@exemplo.test', 'admin', true);
