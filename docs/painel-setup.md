# Painel interno: configuração e runbook

Guia passo a passo para colocar o painel (`/painel`) no ar. **Siga a ordem**:
ela importa para a segurança e para você não ficar trancado para fora.

> O repositório é público (necessário para o GitHub Pages gratuito). O código da
> interface do painel é visível a qualquer pessoa; os **dados** ficam protegidos
> por login (Google) + RLS (Row Level Security) no banco. Nunca coloque chaves
> secretas ou e-mails reais no repositório.

## a. Criar o projeto no Supabase

1. Em https://supabase.com crie um projeto no plano gratuito.
2. Em **Project Settings → API**, anote:
   - a **Project URL** (ex.: `https://xxxx.supabase.co`);
   - a chave **anon / publishable** (pública por design).
3. **NUNCA** use nem copie a chave `service_role` em lugar nenhum: nem no repositório, nem nas variáveis do GitHub.

## b. Aplicar as migrations

No **SQL Editor** do Supabase, cole e execute, **nesta ordem**, o conteúdo de:

1. `supabase/migrations/0001_membros.sql`
2. `supabase/migrations/0002_guardas.sql`
3. `supabase/migrations/0003_endurecer_privilegios.sql`

## c. Cadastrar os admins (ANTES do hook e do primeiro login)

1. Copie `supabase/seed.example.sql` para `supabase/seed.sql` (já está no `.gitignore`, não será commitado).
2. Troque os e-mails fictícios pelos e-mails Google reais dos dois fundadores (minúsculas, sem espaços).
3. Execute no SQL Editor. Os e-mails reais **não** vão para o repositório.

Fazer isso antes de ativar o hook (passo f) evita que você mesmo seja bloqueado no primeiro cadastro.

## d. Autenticação: somente Google

O acesso confia na claim `email` do JWT. Um provedor que não verifica o e-mail
permitiria obter um token com um e-mail autorizado. Por isso:

1. Em **Authentication → Providers**, **desative o cadastro por e-mail/senha** e qualquer outro provedor. Deixe **somente o Google** ativo.
2. No Google Cloud Console: **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth → Aplicativo da Web**.
3. Em **URIs de redirecionamento autorizados**, cole a *Callback URL* mostrada na página do provedor Google no Supabase.
4. Copie o *Client ID* e o *Client Secret* e cole no provedor Google do Supabase. Esses segredos ficam **só no Supabase**, nunca no repositório.

### Configurações OBRIGATÓRIAS (a confiança na claim `email` depende delas)

O acesso é decidido por `auth.jwt() ->> 'email'`. Qualquer conta logada pode
chamar `auth.updateUser({ email })`; se a troca de e-mail fosse confirmada
automaticamente, um token poderia carregar um e-mail da lista que ainda não fez
cadastro (por exemplo, o segundo fundador antes do primeiro login), com acesso de
admin. Confirme no painel do Supabase e marque cada item:

- [ ] **Confirm email** LIGADO (Authentication → Providers → Email / Sign In / Providers).
- [ ] **Secure email change** LIGADO.
- [ ] **Allow anonymous sign-ins** DESLIGADO.
- [ ] **Manual linking** DESLIGADO.
- [ ] Cadastro por e-mail/senha DESLIGADO.
- [ ] Somente o provedor **Google** LIGADO.

**Os DOIS fundadores devem fazer login uma vez logo após o seed** (passo c), para
que o e-mail de cada um já esteja vinculado a uma conta real.

## e. URLs de redirecionamento

Em **Authentication → URL Configuration**:

- **Site URL**: `https://opussoftworks.com.br`
- **Redirect URLs**:
  - `https://opussoftworks.com.br/painel**`
  - `http://localhost:3000/painel**`

O login usa o fluxo **PKCE**: o Supabase acrescenta um parâmetro de consulta ao
`redirectTo`, por isso o curinga `**` é necessário (sem ele o retorno é rejeitado).

## f. Hook "Before User Created"

Em **Authentication → Hooks**, ative **Before User Created** apontando para a
função Postgres `public.hook_bloquear_cadastro`.

A disponibilidade desse hook pode depender do plano do Supabase. Se não estiver
disponível, o acesso **continua protegido pelo RLS**: um estranho consegue criar
uma conta, mas não lê nada. O hook apenas evita contas "lixo".

## g. Verificações únicas no SQL Editor

```sql
select rolbypassrls from pg_roles where rolname = 'postgres';
```

Deve retornar `true`. As tabelas com RLS forçado são lidas por funções
`security definer` cujo dono é `postgres`; se não for `true`, toda ação de admin
e o hook falham fechando (indisponibilidade, não vazamento).

Observação: o Supabase deixa `service_role` com `execute` nas funções do hook e do
trigger (privilégios padrão). É aceitável, mas o hook não é literalmente "só
`supabase_auth_admin`".

## h. Variáveis no GitHub

Em **Settings → Secrets and variables → Actions → Variables** (aba *Variables*, não *Secrets*), crie:

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave anon/publishable

São valores públicos por design. Sem elas o build ainda funciona (vazias), mas o login não.

Depois de criar as variáveis, faça um novo deploy (as variáveis são embutidas no build).

## i. Deploy

O workflow `.github/workflows/pages.yml` só roda em push na branch `redesign`.
Para publicar, faça o merge de `feat/painel` em `redesign`. O workflow roda
`pnpm test`, `pnpm build` e `pnpm check:painel-seo` antes de publicar.

## j. Convenções para novos módulos

Toda nova tabela deve:

1. `enable row level security` **e** `force row level security`;
2. `revoke truncate, references, trigger on ... from anon, authenticated`;
3. `revoke all on ... from anon` (o Supabase concede esses privilégios por padrão);
4. ter políticas usando `public.eh_membro()` / `public.eh_admin()`.

Use `0003_endurecer_privilegios.sql` como modelo.

**PORTÃO OBRIGATÓRIO:** antes de criar a primeira tabela de dados, adicione uma
migration com:

```sql
alter default privileges for role postgres in schema public
  revoke truncate, references, trigger on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on tables from anon;
```

O `TRUNCATE` não é barrado pelo RLS, então sem isso uma tabela nova nasceria
truncável por `anon`/`authenticated`. Essa migration ainda não existe.

## k. Avisos operacionais

- Um admin consegue se desativar via SQL (a interface bloqueia; o banco só garante que reste **ao menos um admin ativo**).
- **Se ficar trancado para fora**: no SQL Editor (que roda como `postgres`), atualize ou insira uma linha de admin, por exemplo
  `update public.membros set ativo = true, papel = 'admin' where email = 'seu@email.com';`
  ou um `insert` como no seed.

## l. Verificação manual final (teste de aceite)

Precisa do projeto real. Marque cada item:

- [ ] Login com e-mail autorizado entra em `/painel`.
- [ ] E-mail fora da lista é bloqueado no cadastro (hook) ou vê "sem acesso".
- [ ] O retorno do OAuth (PKCE) cai em `/painel?code=...` e a guarda **não** manda de volta para `/painel/entrar` antes de o Supabase terminar a troca do código (risco conhecido: confirmar).
- [ ] Teste com **duas** contas Google: uma permitida (entra em `/painel`) e uma bloqueada (volta para `/painel/entrar` com a mensagem "Esta conta Google não está autorizada a acessar o painel.").
- [ ] Abra `https://opussoftworks.com.br/painel` e `/painel/entrar` DIRETO no navegador em produção e confirme que carregam (primeira rota aninhada do site).
- [ ] Revogar um membro remove o acesso na próxima requisição.
- [ ] Um `membro` não vê o item "Membros".
- [ ] Adicionar o mesmo e-mail duas vezes mostra "Este e-mail já está na lista."
- [ ] Desativar o último admin mostra "É preciso manter pelo menos um admin ativo."
- [ ] `view-source` de `/painel` mostra `noindex`.
- [ ] `https://opussoftworks.com.br/robots.txt` tem `Disallow: /painel`.
- [ ] `/painel` não aparece em `sitemap.xml`.
- [ ] Não há link para `/painel` em nenhum lugar do site público.
