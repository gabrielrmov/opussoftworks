# Painel interno — Base segura: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar `/painel` no site da Opus, acessível só a e-mails autorizados via login com Google, com esqueleto do dashboard e gestão de membros.

**Architecture:** O site continua uma exportação estática (`output: "export"`). A barreira real de acesso é o banco (Supabase Postgres + Row Level Security + tabela `membros`); as telas só refletem o estado. O SQL é versionado em `supabase/migrations/` e testado em um Postgres embutido (PGlite) no Vitest, sem Docker.

**Tech Stack:** Next 15.5 (static export), React 19, TypeScript, Tailwind 4, `@supabase/supabase-js`, Vitest + jsdom + Testing Library, `@electric-sql/pglite`, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-13-painel-base-segura-design.md`

## Global Constraints

- Branch de trabalho: `feat/painel`, a partir de `origin/redesign`. O deploy só ocorre quando entra em `redesign` (o workflow dispara nessa branch).
- Site estático: **nenhuma** rota dinâmica, middleware, Server Action ou API route do Next.
- No site só entram `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Nenhuma chave secreta, nenhum e-mail real e nenhum dado de negócio no repositório.
- Login apenas com Google (`signInWithOAuth({ provider: "google" })`). Perfis: `admin` e `membro`.
- `/painel`: `robots: { index: false, follow: false }`, fora do sitemap, `Disallow: /painel` no `robots.txt`, sem link a partir do site público.
- Comparação de e-mail sempre em minúsculas (`lower(...)`).
- Visual: padrão da marca (coral `#FF6039`, grafite `#161616`, fundo `#FAFAFA`, fonte Inter Tight), simples, sem gradiente, brilho ou selos decorativos.
- Textos da interface em português do Brasil.
- O build (`pnpm build`) deve passar mesmo sem as variáveis do Supabase definidas.

## Review Focus

1. **E-mail com caixa diferente** (`Gabriel@Gmail.com` no Google vs `gabriel@gmail.com` na lista): deve ser reconhecido como o mesmo membro. Teste na Task 1.
2. **Membro revogado com sessão ainda válida:** perde o acesso na hora (`ativo = false`), sem esperar o token expirar. Teste na Task 1.
3. **`membro` tentando se promover ou autorizar outros:** o banco recusa; só `admin` altera `membros`. Teste na Task 1.
4. **Remover ou desativar o último `admin`:** o banco recusa, para ninguém trancar a empresa fora do painel. Teste na Task 2.
5. **Sessão ausente ou expirada, ou variáveis do Supabase faltando:** nenhuma tela com dado aparece; mostra login ou aviso de configuração, sem erro não tratado. Testes nas Tasks 3 e 4.

---

### Task 1: Tabela `membros`, políticas de acesso e testes de RLS

**Files:**
- Create: `supabase/migrations/0001_membros.sql`
- Create: `vitest.config.ts`, `tests/db/helpers.ts`, `tests/db/membros.rls.test.ts`
- Modify: `package.json` (devDeps `vitest`, `@electric-sql/pglite`; script `"test": "vitest run"`)

**Interfaces:**
- Produces (SQL): `public.membros(id uuid pk, email text unique, papel text check in ('admin','membro'), ativo boolean default true, criado_em timestamptz)`; funções `public.eh_membro() returns boolean` e `public.eh_admin() returns boolean` (`security definer`, `set search_path = public`, comparam `lower(email)` com `lower(auth.jwt() ->> 'email')`, exigindo `ativo`).
- Produces (TS, `tests/db/helpers.ts`): `novoBanco(): Promise<PGlite>` (cria roles `anon` e `authenticated`, schema `auth` com `auth.jwt()` lendo `request.jwt.claims`, aplica `supabase/migrations/*.sql` em ordem); `comoUsuario(db: PGlite, email: string | null): Promise<void>` (faz `set role authenticated` com os claims do e-mail; `null` usa a role `anon`); `comoAdminDoBanco(db: PGlite): Promise<void>` (volta ao superusuário para preparar dados).
- Produces (política): RLS ligada em `membros`. `select`: qualquer membro ativo vê a própria linha; `admin` vê todas. `insert`/`update`/`delete`: só `eh_admin()`. `anon` não faz nada.

- [ ] **Step 1: Configurar o Vitest** — `vitest.config.ts` com alias `@` → raiz do repo (espelhando `tsconfig.json`) e `environment: "node"` por padrão; instalar `vitest` e `@electric-sql/pglite`; script `test`.
- [ ] **Step 2: Escrever os testes que falham** em `tests/db/membros.rls.test.ts`, com a base preparada via `comoAdminDoBanco` (`ana@x.com` admin ativa, `beto@x.com` membro ativo, `caio@x.com` membro `ativo=false`):
  - `"admin lê todos os membros"` → `comoUsuario(db,"ana@x.com")`; `select count(*) from membros` = 3.
  - `"membro lê só a própria linha"` → beto vê 1 linha, com o próprio e-mail.
  - `"e-mail fora da lista não lê nada"` → `"zeca@x.com"` vê 0 linhas.
  - `"anon não lê nem escreve"` → `comoUsuario(db,null)`: `select` devolve 0 linhas e `insert` lança erro.
  - `"e-mail com caixa diferente é reconhecido"` → `"Beto@X.com"` vê 1 linha.
  - `"membro revogado perde o acesso"` → `caio@x.com` vê 0 linhas.
  - `"membro não se promove nem autoriza outros"` → beto: `update membros set papel='admin' where email='beto@x.com'` afeta 0 linhas; `insert` de um novo e-mail lança erro.
  - `"admin adiciona e revoga"` → ana insere `dani@x.com` e depois faz `update ... set ativo=false`; ambos têm efeito.
- [ ] **Step 3: Rodar `pnpm test` e confirmar que falha** (migração ainda não existe).
- [ ] **Step 4: Implementar `0001_membros.sql`** com a tabela, as duas funções, `alter table membros enable row level security` e `force row level security`, e as políticas descritas em Interfaces. As funções precisam ser `security definer` para evitar recursão de política.
- [ ] **Step 5: Rodar `pnpm test`** — todos passam.
- [ ] **Step 6: Commit** — `git add supabase tests vitest.config.ts package.json pnpm-lock.yaml && git commit -m "feat(painel): tabela membros com RLS e testes"`.

### Task 2: Guarda do último admin e hook de cadastro

**Files:**
- Create: `supabase/migrations/0002_guardas.sql`, `tests/db/guardas.test.ts`

**Interfaces:**
- Consumes: `public.membros`, `comoUsuario`, `comoAdminDoBanco`, `novoBanco` (Task 1).
- Produces (SQL): trigger `membros_preservar_ultimo_admin` (antes de `update` e `delete`) que lança exceção se a operação deixaria **zero** admins ativos; função `public.hook_bloquear_cadastro(event jsonb) returns jsonb` para o hook "Before User Created" do Supabase: devolve `'{}'::jsonb` se `lower(event->'user'->>'email')` consta ativo em `membros`, senão devolve `{"error":{"message":"Acesso restrito.","http_code":403}}`.

- [ ] **Step 1: Testes que falham** em `tests/db/guardas.test.ts`:
  - `"não permite desativar o último admin"` → com só `ana` admin, `update ... set ativo=false` lança erro.
  - `"não permite remover o último admin"` → `delete` lança erro.
  - `"permite desativar um admin quando há outro"` → com dois admins ativos, desativar um funciona.
  - `"hook libera e-mail autorizado, em qualquer caixa"` → `hook_bloquear_cadastro('{"user":{"email":"ANA@x.com"}}')` = `{}`.
  - `"hook bloqueia e-mail fora da lista ou revogado"` → resposta contém `error` com `http_code` 403.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar `0002_guardas.sql`** (trigger e função, `grant execute` do hook ao papel `supabase_auth_admin`; no PGlite crie esse papel no helper se o `grant` o exigir).
- [ ] **Step 4: Rodar `pnpm test`** — passam, junto com os da Task 1.
- [ ] **Step 5: Commit** — `feat(painel): guarda do último admin e hook de cadastro`.

### Task 3: Cliente Supabase e estado de acesso

**Files:**
- Create: `lib/supabase/client.ts`, `lib/painel/use-acesso.ts`, `tests/painel/use-acesso.test.tsx`
- Modify: `package.json` (deps `@supabase/supabase-js`; devDeps `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`)

**Interfaces:**
- Produces: `getSupabase(): SupabaseClient | null` (singleton; `null` se faltar `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`; leia as duas variáveis **literalmente** como `process.env.NEXT_PUBLIC_SUPABASE_URL`, sem acesso dinâmico, senão o Next não as embute no build estático); `type Acesso = { estado: "carregando" | "nao-configurado" | "sem-sessao" | "sem-acesso" | "ok"; papel?: "admin" | "membro"; email?: string }`; `useAcesso(): Acesso` — lê a sessão, consulta a própria linha em `membros` e reage a `onAuthStateChange`; `entrarComGoogle(): Promise<void>` (redireciona para `${origin}/painel`); `sair(): Promise<void>`.

- [ ] **Step 1: Testes que falham** (`// @vitest-environment jsdom`, com `getSupabase` mockado):
  - `"sem variáveis → nao-configurado"`.
  - `"sem sessão → sem-sessao"`.
  - `"sessão mas sem linha em membros → sem-acesso"`.
  - `"sessão e linha ativa → ok, com o papel"`.
  - `"linha com ativo=false → sem-acesso"`.
  - `"enquanto carrega → carregando, nunca ok"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** os dois módulos. A consulta é `from("membros").select("papel, ativo").maybeSingle()` (a RLS já filtra a linha do próprio usuário).
- [ ] **Step 4: Rodar `pnpm test`** — passam.
- [ ] **Step 5: Commit** — `feat(painel): cliente Supabase e estado de acesso`.

### Task 4: Rota `/painel`, login e guarda de tela

**Files:**
- Create: `app/painel/layout.tsx`, `app/painel/entrar/page.tsx`, `components/painel/guarda.tsx`, `tests/painel/guarda.test.tsx`
- Modify: `components/ui/conditional-header.tsx` (adicionar `"/painel"` a `HIDE_HEADER_ON_PREFIX`)

**Interfaces:**
- Consumes: `useAcesso`, `entrarComGoogle`, `sair`, `Acesso` (Task 3).
- Produces: `<Guarda papel?: "admin">{children}</Guarda>` — renderiza `children` só com `estado === "ok"` (e papel `admin` quando exigido); em `carregando` mostra um indicador neutro; `sem-sessao` redireciona (`router.replace`) para `/painel/entrar`; `sem-acesso` mostra "Você não tem acesso a este painel" com botão Sair; `nao-configurado` mostra "Painel ainda não configurado". `app/painel/layout.tsx` exporta `metadata.robots = { index: false, follow: false }` e usa fundo `#FAFAFA` próprio, **sem** o chrome público (WhatsApp, voltar ao topo, AOS).

- [ ] **Step 1: Testes que falham** (jsdom; `useAcesso` mockado):
  - `"não renderiza children enquanto carrega"`.
  - `"sem sessão redireciona para /painel/entrar e não mostra children"`.
  - `"sem acesso mostra a mensagem e o botão Sair, sem children"`.
  - `"ok renderiza children"`.
  - `"exigindo admin, membro comum vê aviso de permissão"`.
  - `"não configurado mostra o aviso e não quebra"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** a guarda, o layout e a página de login (botão "Entrar com Google"; exibe o erro de retorno do OAuth quando houver `error_description` na URL).
- [ ] **Step 4: `pnpm test` e `pnpm build`** — passam; `out/painel/entrar/index.html` existe.
- [ ] **Step 5: Commit** — `feat(painel): rota, login e guarda de tela`.

### Task 5: Esqueleto do painel e visão geral

**Files:**
- Create: `app/painel/page.tsx`, `components/painel/menu-lateral.tsx`, `tests/painel/menu-lateral.test.tsx`

**Interfaces:**
- Consumes: `Guarda`, `useAcesso` (Tasks 3 e 4).
- Produces: `<MenuLateral papel: "admin" | "membro" />` com os itens Visão geral, Projetos e equipe, Clientes e comercial, Financeiro, Campanhas e, **só para `admin`**, Membros (`/painel/membros`). `/painel` mostra um cartão por área, cada um com o texto "Em breve", dentro de `<Guarda>`.

- [ ] **Step 1: Testes que falham:**
  - `"membro não vê o item Membros"`.
  - `"admin vê o item Membros com href /painel/membros"`.
  - `"os quatro cartões de área aparecem com 'Em breve'"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** os componentes e a página, seguindo o visual da marca (sem gradiente nem selos).
- [ ] **Step 4: `pnpm test` e `pnpm build`** — passam.
- [ ] **Step 5: Commit** — `feat(painel): menu lateral e visão geral`.

### Task 6: Gestão de membros (admin)

**Files:**
- Create: `app/painel/membros/page.tsx`, `lib/painel/membros.ts`, `tests/painel/membros.test.ts`

**Interfaces:**
- Consumes: `getSupabase`, `Guarda papel="admin"`.
- Produces: `listarMembros(): Promise<Membro[]>`; `adicionarMembro(email: string, papel: "admin" | "membro"): Promise<void>` (normaliza para minúsculas, `trim`, rejeita e-mail inválido com erro em português); `definirAtivo(id: string, ativo: boolean): Promise<void>`; `type Membro = { id: string; email: string; papel: "admin" | "membro"; ativo: boolean }`. A página lista, adiciona e ativa/desativa, e exibe a mensagem de erro do banco quando a regra do último admin recusar.

- [ ] **Step 1: Testes que falham** (cliente mockado):
  - `"adicionarMembro normaliza o e-mail para minúsculas e sem espaços"`.
  - `"adicionarMembro rejeita e-mail inválido sem chamar o banco"`.
  - `"definirAtivo envia ativo=false para o id certo"`.
  - `"erro do banco vira mensagem em português"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** o módulo e a página (a página só é acessível com `papel="admin"`).
- [ ] **Step 4: `pnpm test` e `pnpm build`** — passam.
- [ ] **Step 5: Commit** — `feat(painel): gestão de membros`.

### Task 7: Higiene de SEO do painel

**Files:**
- Modify: `app/robots.ts` (adicionar `disallow: "/painel"` à regra `*`)
- Create: `scripts/check-painel-seo.mjs`, `tests/seo/robots.test.ts`
- Modify: `package.json` (script `"check:painel-seo": "node scripts/check-painel-seo.mjs"`)

**Interfaces:**
- Produces: `check-painel-seo.mjs` — lê `out/`; falha (exit 1) se algum `out/painel/**/index.html` não tiver `noindex`, ou se `out/sitemap.xml` citar `/painel`.

- [ ] **Step 1: Testes que falham:** `"robots inclui Disallow /painel e continua permitindo /"` (chamando a função padrão de `app/robots.ts`).
- [ ] **Step 2: Rodar e ver falhar; implementar; rodar e passar.**
- [ ] **Step 3: Implementar o script** e executar `pnpm build && pnpm check:painel-seo` — saída esperada: `ok`.
- [ ] **Step 4: Commit** — `feat(painel): robots e checagem de noindex`.

### Task 8: Deploy, runbook e seed

**Files:**
- Modify: `.github/workflows/pages.yml` (passos `pnpm test` e `pnpm check:painel-seo` após o build; `env` do build com `NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL }}` e `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ vars.NEXT_PUBLIC_SUPABASE_ANON_KEY }}`)
- Create: `docs/painel-setup.md`, `supabase/seed.example.sql`

- [ ] **Step 1: Escrever `docs/painel-setup.md`** com, na ordem: criar o projeto no Supabase; aplicar `supabase/migrations/*.sql` no SQL Editor; criar o cliente OAuth no Google Cloud e ativar o provedor Google no Supabase; cadastrar as URLs de redirecionamento (`https://opussoftworks.com.br/painel` e `http://localhost:3000/painel`); ativar o hook "Before User Created" apontando para `public.hook_bloquear_cadastro`; cadastrar os admins pelo SQL Editor (seguindo o `seed.example.sql`, com e-mails fictícios); criar as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em Settings → Variables → Actions.
- [ ] **Step 2: `supabase/seed.example.sql`** com `insert` de admins usando e-mails de exemplo e o aviso de que o arquivo real **não** vai para o repositório.
- [ ] **Step 3: Verificação manual** (depende das ações do Gabriel; registrar o resultado no PR): login com e-mail autorizado entra; e-mail fora da lista é bloqueado no cadastro ou vê "sem acesso"; revogar um membro tira o acesso na próxima requisição; `view-source` de `/painel` mostra `noindex`; Search Console não recebe `/painel`.
- [ ] **Step 4: Rodar `pnpm test && pnpm build && pnpm check:painel-seo`** — tudo passa.
- [ ] **Step 5: Commit** — `ci(painel): variáveis, testes no deploy e runbook`.
