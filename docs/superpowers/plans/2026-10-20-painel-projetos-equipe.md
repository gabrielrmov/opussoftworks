# Painel interno — Módulo Projetos e equipe: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a lista de projetos (com equipe) do painel: tabela `projetos` protegida por RLS, tela `/painel/projetos` e o resumo na visão geral.

**Architecture:** Mesmo desenho da base: o banco (Supabase Postgres + RLS) é a barreira; as telas só refletem. SQL versionado em `supabase/migrations/` e testado em PGlite; a lógica de dados vive em `lib/painel/projetos.ts` (testável sem tela); a página usa `<Guarda>` e `<Casca>` existentes.

**Tech Stack:** Next 15.5 (static export), React 19, TypeScript, Tailwind 4, `@supabase/supabase-js`, Vitest + jsdom + `@electric-sql/pglite`, pnpm, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-20-painel-projetos-equipe-design.md` (a base: `docs/superpowers/specs/2026-10-13-painel-base-segura-design.md`)

## Global Constraints

- Branch `feat/painel-projetos`, a partir de `redesign`. Não dar push; o Gabriel faz.
- Site estático: nenhuma rota dinâmica, middleware, Server Action ou API route do Next.
- Nenhum e-mail real, chave ou dado de negócio no repositório (e-mails fictícios `@x.com` / `@exemplo.test` nos testes).
- `tipo` ∈ `site | sistema | trafego | outro`; `status` ∈ `planejado | em_andamento | em_revisao | pausado | concluido` (padrão `planejado`); `nome` e `cliente` 1–120 caracteres após `btrim`; `observacoes` até 2000; `prazo` é `date` opcional.
- RLS ligado **e forçado** em `projetos`; `select`/`insert`/`update` com `public.eh_membro()`; `delete` com `public.eh_admin()`; nada para `anon`; sem `truncate`/`references`/`trigger` para `anon` e `authenticated`.
- Um `update`/`delete` filtrado pelo RLS devolve zero linhas **sem erro**: a tela nunca trata isso como sucesso (vira erro de permissão).
- Nunca exibir texto cru do banco ao usuário; mensagens em português do Brasil, passando por `mensagemDeErro`.
- "Hoje" para o "atrasado" é a data no fuso `America/Sao_Paulo` (via `Intl`), não a do navegador; prazo vencido = anterior a hoje e status ≠ `concluido`.
- Visual: coral `#FF6039` só como destaque, grafite `#161616`, fundo `#FAFAFA`, Inter Tight, sem gradiente/brilho/selos; a lista vira cartões no celular; campos rotulados, utilizáveis por teclado.
- `pnpm test`, `pnpm build` e `pnpm check:painel-seo` passam ao fim de cada tarefa que toca código; o build passa sem as variáveis do Supabase.

## Review Focus

1. **Membro revogado no meio da sessão** tentando editar/criar projeto: o banco recusa (0 linhas / RLS). Teste na Task 1.
2. **`nome`/`cliente` só com espaços** (ou acima de 120): recusados no banco e na validação, sem ir ao banco. Testes nas Tasks 1 e 2.
3. **Prazo "hoje", prazo passado com status `concluido`, e a virada do dia em UTC vs São Paulo:** não aparecem como atrasados indevidamente. Testes na Task 2.
4. **Apagar um membro que é responsável:** o projeto continua, com responsável vazio. Teste na Task 1.
5. **Carga lenta chegando depois de uma carga nova** (ou duplo clique em "Salvar") sobrescrevendo/duplicando: a tela descarta a resposta velha e desabilita o botão enquanto salva. Testes na Task 3.

---

### Task 1: Migrações 0004 (privilégios padrão) e 0005 (projetos) + testes de banco

**Files:**
- Create: `supabase/migrations/0004_privilegios_padrao.sql`, `supabase/migrations/0005_projetos.sql`
- Create: `tests/db/privilegios-padrao.test.ts`, `tests/db/projetos.rls.test.ts`

**Interfaces:**
- Consumes (já existem): `novoBanco()`, `comoUsuario(db, email | null)`, `comoAdminDoBanco(db)` de `tests/db/helpers.ts` (aplica `supabase/migrations/*.sql` em ordem, num banco onde `anon`/`authenticated` recebem privilégios padrão como no Supabase); `public.membros`, `public.eh_membro()`, `public.eh_admin()`.
- Produces (SQL): tabela `public.projetos(id, nome, cliente, tipo, status, prazo, responsavel_id, observacoes, criado_em, atualizado_em)` conforme as Global Constraints; função `public.equipe() returns table (id uuid, email text, papel text)`.

- [ ] **Step 1: Testes que falham** em `tests/db/privilegios-padrao.test.ts`: `"tabela criada depois da 0004 nasce sem truncate/references/trigger para authenticated"` (cria uma tabela qualquer como superusuário e consulta `has_table_privilege('authenticated', ..., 'TRUNCATE' | 'REFERENCES' | 'TRIGGER')` = false e `'SELECT'` continua true); `"... nasce sem nenhum privilégio para anon"`; `"função criada depois da 0004 não é executável por anon"` (`has_function_privilege`).
- [ ] **Step 2: Testes que falham** em `tests/db/projetos.rls.test.ts` (base preparada com `comoAdminDoBanco`: `ana@x.com` admin ativa, `beto@x.com` membro ativo, `caio@x.com` membro `ativo=false`, `zeca@x.com` fora da lista), cada erro com padrão específico (`/row-level security|permission denied|violates check constraint/`):
  - `"anon não lê nem escreve projetos"` (select → permission denied; insert → permission denied).
  - `"e-mail fora da lista e membro revogado não leem nem escrevem"` (select = 0 linhas; insert → `/row-level security/`).
  - `"membro ativo cria, lê e edita"` e `"atualizado_em muda no update"`.
  - `"membro revogado no meio da sessão perde a escrita"` (mesma identidade escreve, o superusuário faz `ativo=false`, depois o update afeta 0 linhas e o insert falha).
  - `"membro comum não apaga: delete afeta 0 linhas e o projeto continua"`; `"admin apaga"`.
  - `"truncate negado para authenticated"`.
  - Constraints: `tipo` inválido, `status` inválido, `nome` vazio, `nome` só com espaços, `nome` com 121 caracteres, `cliente` só com espaços, `observacoes` com 2001 caracteres → recusados; `status` padrão = `planejado`; os valores limite (120 e 2000 caracteres) são aceitos.
  - `"apagar um membro responsável zera responsavel_id e mantém o projeto"`.
  - `equipe()`: `"devolve só membros ativos, ordenados por e-mail, para um membro"` (não inclui `caio`); `"devolve vazio para e-mail fora da lista e para membro revogado"`; `"anon não executa equipe()"` (`/permission denied/`).
- [ ] **Step 3: Rodar `pnpm vitest run tests/db` e ver falhar** (migrações inexistentes).
- [ ] **Step 4: Implementar `0004_privilegios_padrao.sql`:** `alter default privileges for role postgres in schema public` revogando `truncate, references, trigger` de tabelas futuras para `anon, authenticated`, todos os privilégios de tabelas futuras para `anon`, e `execute` de funções futuras para `anon`. Não toca objetos existentes.
- [ ] **Step 5: Implementar `0005_projetos.sql`:** a tabela com as constraints (`check (btrim(nome) <> '' and char_length(btrim(nome)) <= 120)`, idem `cliente`, listas fechadas para `tipo`/`status`, `char_length(observacoes) <= 2000`), FK `responsavel_id references public.membros(id) on delete set null`, índices em `status` e `prazo`, gatilho `BEFORE UPDATE` que define `atualizado_em = now()`, RLS `enable` + `force`, as quatro políticas (`select/insert/update` com `eh_membro()`, `delete` com `eh_admin()`, todas `to authenticated`), revogações explícitas na própria migração (como defesa em duas camadas), e a função `equipe()` (`security definer`, `set search_path = public`, filtra `ativo` e exige `public.eh_membro()`, ordem por e-mail; `revoke ... from public, anon`; `grant execute ... to authenticated`).
- [ ] **Step 6: Rodar `pnpm test`** — todos os testes de banco (antigos e novos) passam.
- [ ] **Step 7: Verificação de regressão do teste (mutação):** em cópia descartável da 0005, trocar `eh_membro()` por `true` numa política e confirmar que os testes novos falham; restaurar (nada disso é commitado).
- [ ] **Step 8: Commit** — `feat(painel): migrações de privilégios padrão e tabela de projetos com testes`.

### Task 2: Biblioteca de dados `lib/painel/projetos.ts` e erros compartilhados

**Files:**
- Create: `lib/painel/erros.ts`, `lib/painel/projetos.ts`, `tests/painel/projetos.test.ts`
- Modify: `lib/painel/membros.ts` (passa a importar de `erros.ts`; continua exportando `mensagemDeErro` e demais para não quebrar `tests/painel/membros.test.ts`)

**Interfaces:**
- Consumes: `getSupabase()` de `@/lib/supabase/client`.
- Produces (`lib/painel/erros.ts`): `class ErroDeValidacao extends Error`; `mensagemDeErro(erro: unknown): string` — os mapeamentos atuais de `membros.ts` (23505, "ultimo admin", 42501/permission denied/row-level security, não configurado) **mais** `23514` sem "ultimo admin" → "Algum campo está com um valor inválido." e o genérico; `exigirCliente(): SupabaseClient` (lança `ErroDeValidacao("Painel ainda não configurado.")` quando `getSupabase()` é `null`).
- Produces (`lib/painel/projetos.ts`): tipos `TipoProjeto`, `StatusProjeto`, `Projeto = { id: string; nome: string; cliente: string; tipo: TipoProjeto; status: StatusProjeto; prazo: string | null; responsavel_id: string | null; observacoes: string | null; criado_em: string; atualizado_em: string }`, `DadosProjeto` (campos editáveis, `prazo` e `responsavel_id` e `observacoes` opcionais), `MembroEquipe = { id: string; email: string; papel: "admin" | "membro" }`; constantes `TIPOS`, `STATUS` (listas com rótulo em português); funções `validarProjeto(dados: DadosProjeto): DadosProjeto` (puro: `trim`, tamanhos, listas; lança `ErroDeValidacao` em português), `hojeEmSaoPaulo(agora?: Date): string` (`YYYY-MM-DD`), `estaAtrasado(p: Pick<Projeto, "prazo" | "status">, hoje: string): boolean`, `listarProjetos(): Promise<Projeto[]>` (ordem `prazo` crescente com nulos no fim, depois `nome`), `criarProjeto(dados): Promise<void>`, `atualizarProjeto(id, dados): Promise<void>`, `apagarProjeto(id): Promise<void>`, `listarEquipe(): Promise<MembroEquipe[]>` (via `rpc("equipe")`), `contarEmAndamento(): Promise<number>`.

- [ ] **Step 1: Testes que falham** em `tests/painel/projetos.test.ts` (node, `getSupabase` mockado na fronteira do módulo): `validarProjeto` — `"remove espaços e aceita o mínimo"`, `"rejeita nome vazio ou só espaços sem chamar o banco"`, `"rejeita cliente acima de 120"`, `"rejeita tipo/status fora da lista"`, `"rejeita observações acima de 2000"`; `hojeEmSaoPaulo` — `"2026-03-10T02:30:00Z"` devolve `"2026-03-09"` (ainda é 9 em São Paulo) e `"2026-03-10T03:00:00Z"` devolve `"2026-03-10"`; `estaAtrasado` — `"prazo de ontem e em andamento: atrasado"`, `"prazo de hoje: não"`, `"prazo de amanhã: não"`, `"prazo vencido mas concluído: não"`, `"sem prazo: não"`; `atualizarProjeto`/`apagarProjeto` — `"zero linhas afetadas vira erro de permissão"` (mock devolve `{ data: [], error: null }`; a mensagem final de `mensagemDeErro` é "Você não tem permissão para fazer isso."), `"uma linha afetada resolve"`; `criarProjeto` — `"envia os dados já validados e normalizados"`; `listarProjetos` — `"pede ordem por prazo (nulos no fim) e nome"`; `listarEquipe` — `"chama a função equipe"`; `mensagemDeErro` — `"23514 comum vira mensagem de valor inválido; ultimo admin continua com a sua mensagem; texto desconhecido não vaza"`; sem Supabase configurado → "Painel ainda não configurado.".
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** `erros.ts` (extraindo de `membros.ts`) e `projetos.ts` com as assinaturas acima; `hojeEmSaoPaulo` com `Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" })`; `atualizar`/`apagar` encadeiam `.select("id")` e lançam `{ code: "42501", message: "nenhuma linha afetada" }` quando não volta linha; `membros.ts` reexporta `mensagemDeErro`.
- [ ] **Step 4: Rodar `pnpm test`** (inclui os testes antigos de `membros`) — passam.
- [ ] **Step 5: Commit** — `feat(painel): erros compartilhados e biblioteca de projetos`.

### Task 3: Tela `/painel/projetos` e formulário

**Files:**
- Create: `components/painel/projeto-form.tsx`, `app/painel/projetos/page.tsx`, `tests/painel/projetos-page.test.tsx`

**Interfaces:**
- Consumes: tudo o que `lib/painel/projetos.ts` produz (Task 2); `mensagemDeErro` de `lib/painel/erros.ts`; `<Guarda>` (`components/painel/guarda.tsx`), `<Casca papel email>` (`components/painel/casca.tsx`), `useAcesso()` (`lib/painel/use-acesso.ts`, retorna `{ estado, papel?, email? }`). Siga a estrutura de `app/painel/membros/page.tsx` (um componente interno lê `useAcesso()` dentro de `<Guarda>`).
- Produces: `<ProjetoForm inicial?: Projeto equipe: MembroEquipe[] salvando: boolean onSalvar(dados: DadosProjeto): void onCancelar(): void erro?: string />`; a rota `/painel/projetos`.

- [ ] **Step 1: Testes que falham** (jsdom; `lib/painel/projetos`, `useAcesso` e `next/navigation` mockados): `"mostra carregando e depois a lista com nome, cliente, tipo, status, prazo e responsável"`; `"estado vazio: Nenhum projeto ainda"`; `"erro de carga mostra a mensagem em português e não o texto cru"`; `"filtro por status mostra só os do status"`; `"prazo vencido e não concluído mostra 'atrasado'"` (relógio injetado/fake timers); `"criar: campos obrigatórios; Salvar chama criarProjeto com os dados normalizados e recarrega"`; `"editar abre o formulário preenchido e chama atualizarProjeto"`; `"botão Salvar fica desabilitado enquanto salva (sem duplicar)"`; `"membro comum não vê o botão Apagar; admin vê"`; `"apagar exige confirmação em dois passos (primeiro clique só pede confirmar)"`; `"lista a equipe e usa os membros ativos no seletor de responsável"`; `"carga antiga que chega depois de uma nova não sobrescreve a lista"` (promessas diferidas); `"erro ao salvar mostra a mensagem mapeada"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** `ProjetoForm` (campos rotulados: nome, cliente, tipo, status, prazo, responsável, observações; validação no envio via `validarProjeto` com a mensagem do erro) e a página (lista ordenada como a biblioteca devolve; cartões no celular via classes responsivas; contador de requisição para descartar respostas antigas; `salvando` desabilita o botão; apagar em dois passos no próprio item e só para `papel === "admin"`; bloco "Equipe" só de leitura). Estilo conforme as Global Constraints.
- [ ] **Step 4: Rodar `pnpm test`, `pnpm build` e `pnpm check:painel-seo`** — passam; `out/painel/projetos.html` existe e contém `noindex`.
- [ ] **Step 5: Commit** — `feat(painel): tela de projetos com formulário e equipe`.

### Task 4: Integração (menu, visão geral) e runbook

**Files:**
- Create: `lib/painel/areas.ts`
- Modify: `components/painel/menu-lateral.tsx`, `app/painel/page.tsx`, `tests/painel/menu-lateral.test.tsx`, `docs/painel-setup.md`

**Interfaces:**
- Consumes: `contarEmAndamento()` (Task 2); rota `/painel/projetos` (Task 3).
- Produces: `AREAS: ReadonlyArray<{ nome: string; href?: string }>` em `lib/painel/areas.ts`, com "Projetos e equipe" em `href: "/painel/projetos"` e as outras três sem `href` (ainda "em breve"); a lista duplicada em `menu-lateral.tsx` e `app/painel/page.tsx` passa a usar essa constante.

- [ ] **Step 1: Testes que falham** em `tests/painel/menu-lateral.test.tsx`: `"Projetos e equipe é um link para /painel/projetos"`; `"Clientes e comercial, Financeiro e Campanhas continuam não-links com 'em breve'"`; `"item ativo tem aria-current em /painel/projetos"`. Teste da visão geral (novo arquivo `tests/painel/visao-geral.test.tsx`): `"cartão de Projetos mostra 'N em andamento'"` e `"se a contagem falhar mostra '—' sem quebrar a página"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** `areas.ts` e ajustar o menu e a visão geral (o cartão de Projetos é um link com o resumo; os demais seguem "Em breve").
- [ ] **Step 4: Atualizar `docs/painel-setup.md`:** passo "Módulo Projetos e equipe" — aplicar `0004` e `0005` no SQL Editor **antes** de publicar o código, em ordem; a convenção para os próximos módulos (o `alter default privileges` da 0004 só vale para objetos criados por `postgres`, o papel do SQL Editor; cada tabela nova ainda revoga explicitamente e usa `eh_membro()`/`eh_admin()`); e a linha de verificação manual (criar um projeto, editá-lo, conferir que um membro comum não vê "Apagar").
- [ ] **Step 5: Rodar `pnpm test && pnpm build && pnpm check:painel-seo`** — passam.
- [ ] **Step 6: Commit** — `feat(painel): menu e visão geral ligados ao módulo de projetos; runbook`.
