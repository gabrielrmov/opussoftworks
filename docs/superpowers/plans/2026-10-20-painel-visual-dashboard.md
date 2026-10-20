# Painel interno — Redesenho visual e dashboard: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar ao painel o visual e a estrutura de um dashboard (casca, tema claro/escuro, visão geral com indicadores e gráficos, lista e gaveta de projetos) conforme o modelo aprovado, sem mudar banco nem comportamento.

**Architecture:** CSS escopado do painel (`app/painel/painel.css`, variáveis de tema, classes `pn-*`) importado só pelo layout do painel; cálculos do dashboard em funções puras (`lib/painel/resumo.ts`) alimentando componentes de apresentação (gráficos em SVG); páginas existentes mantêm lógica e textos, mudando só a apresentação; formulário de projeto passa a uma gaveta acessível.

**Tech Stack:** Next 15.5 (static export), React 19, TypeScript, CSS escopado (sem novas dependências), Vitest + jsdom, pnpm, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-20-painel-visual-dashboard-design.md` · **Referência visual aprovada:** `docs/design/painel-modelo-v2.html` (abrir no navegador; todas as proporções, cores e espaçamentos saem dele).

## Global Constraints

- Branch `feat/painel-visual`, a partir de `redesign`. Sem push (o Gabriel faz). **Nenhuma migração, nenhuma mudança em `supabase/`, `lib/supabase/` ou `lib/painel/{membros,projetos,erros,use-acesso}.ts` além do que a tarefa disser.**
- Site estático (`output: "export"`): sem rotas dinâmicas, middleware ou Server Actions; sem novas dependências npm.
- Marca: coral `#FF6039` só como destaque, grafite `#161616`, Inter Tight (já global); **sem gradientes decorativos, brilhos ou selos**. Tokens de tema como no modelo (claro: fundo `#F4F4F0`, cartão `#FFFFFF`, borda `#E7E7E1`, texto `#161616`, mudo `#6D6D68`; escuro: fundo `#0E0E0F`, cartão `#161617`, borda `#252527`, texto `#F3F3EF`, mudo `#8F8F8A`).
- Estilo apenas por classes com prefixo `pn-` e variáveis CSS declaradas sob o contêiner `.pn-raiz`; **nada pode vazar para o site público** (nenhum seletor global de elemento).
- Textos de interface já existentes não mudam ("Novo projeto", "Salvar", "Cancelar", "Apagar", "Confirmar exclusão", "Nenhum projeto ainda.", "Tentar novamente", "Carregando…", "Sair", "Entrar com Google"…). Testes existentes são **atualizados, nunca removidos**; todo comportamento atual permanece (guarda de resposta antiga, bloqueio de duplo envio, Apagar só admin em dois passos, erro de carga sem estado vazio falso, mensagens mapeadas).
- Tema: `data-tema="claro"|"escuro"` no contêiner do painel; padrão claro; escolha lembrada em `localStorage` (chave `painel-tema`) com `try/catch` (indisponível/inválido → claro); aplicado antes da pintura por script embutido no layout.
- Acessibilidade: foco visível; ícones decorativos `aria-hidden`; gráficos com `role="img"` e `aria-label` em português resumindo os valores; gaveta `role="dialog"` + `aria-modal`; animações respeitam `prefers-reduced-motion`.
- Datas: "hoje" vem de `hojeEmSaoPaulo()` (já existe); semana começa na **segunda**; aritmética de calendário em UTC sobre strings `YYYY-MM-DD`.
- `pnpm test`, `pnpm build` e `pnpm check:painel-seo` passam ao fim de cada tarefa; o build passa sem variáveis do Supabase; saída de testes sem avisos.

## Review Focus

1. **`localStorage` indisponível, lançando erro ou com valor inválido:** o painel abre em claro sem quebrar. Teste na Task 1.
2. **Bordas de semana e data:** prazo em domingo/segunda, virada de mês e de ano, prazo = hoje, hoje em segunda ou domingo, projeto concluído nunca conta. Testes na Task 2.
3. **Gaveta:** Esc e clique no fundo **não** fecham enquanto salva; o foco volta ao botão que abriu; abrir "Editar" de outro projeto não herda valores do anterior. Testes na Task 4.
4. **Dados vazios ou degenerados:** zero projetos, equipe que falhou ao carregar, todos os valores zero — sem `NaN`, sem divisão por zero, gráficos legíveis. Testes nas Tasks 2 e 3.
5. **Telas estreitas (360 px) sem rolagem horizontal:** verificado visualmente na Task 5 (jsdom não mede layout).

---

### Task 1: Fundação visual — CSS escopado, tema, casca e menu

**Files:**
- Create: `app/painel/painel.css`, `lib/painel/tema.ts`, `components/painel/tema.tsx`, `tests/painel/tema.test.ts`, `tests/painel/tema-toggle.test.tsx`
- Modify: `app/painel/layout.tsx`, `components/painel/casca.tsx`, `components/painel/menu-lateral.tsx`, `tests/painel/menu-lateral.test.tsx` (e qualquer teste que dependa do DOM antigo da casca)

**Interfaces:**
- Produces (`lib/painel/tema.ts`): `type Tema = "claro" | "escuro"`; `CHAVE_TEMA = "painel-tema"`; `lerTema(): Tema` (nunca lança; qualquer erro/valor inválido → `"claro"`); `salvarTema(t: Tema): void` (nunca lança); `SCRIPT_TEMA: string` (JS autocontido para o layout: lê a chave e define `data-tema` no elemento anterior ao `<script>`, tudo em `try/catch`).
- Produces (`components/painel/tema.tsx`): `<AlternarTema />` (botão com `aria-label="Alternar tema"`, ícone lua/sol decorativo; alterna o `data-tema` do contêiner `.pn-raiz` mais próximo e chama `salvarTema`).
- Produces (`Casca`): mesma assinatura `<Casca papel email>{children}</Casca>` **mais** `acaoTopo?: ReactNode` (renderizado na barra superior, à direita do `AlternarTema`).
- Produces (`painel.css`): variáveis e classes `pn-*` para casca (`pn-app`, `pn-lateral`, `pn-marca`, `pn-nav`, `pn-topo`, `pn-conteudo`), cartão (`pn-cartao`), botões (`pn-btn`, `pn-btn-sec`, `pn-ic`), campos, tipografia (`pn-h1`, `pn-sub`) e utilitários usados pelas demais tarefas; reproduz o modelo.

- [ ] **Step 1: Testes que falham** em `tests/painel/tema.test.ts`: `"lerTema devolve claro sem valor salvo"`, `"lerTema lê escuro quando salvo"`, `"lerTema ignora valor inválido e devolve claro"`, `"lerTema devolve claro quando localStorage lança erro"` (mock de `Storage` que lança), `"salvarTema não lança quando localStorage lança"`, `"SCRIPT_TEMA executa sem erro quando localStorage lança e deixa data-tema claro"`.
- [ ] **Step 2: Testes que falham** em `tests/painel/tema-toggle.test.tsx` (jsdom): `"alterna de claro para escuro e atualiza data-tema do contêiner"`, `"persiste a escolha em localStorage"`, `"o botão tem nome acessível 'Alternar tema'"`; e em `tests/painel/menu-lateral.test.tsx` atualizar para o novo DOM sem perder as asserções atuais (links, `aria-current`, "em breve", Membros só admin) e acrescentar `"ícones são aria-hidden"`.
- [ ] **Step 3: Rodar e ver falhar.**
- [ ] **Step 4: Implementar** `tema.ts`, `tema.tsx`, `painel.css` (a partir do modelo), `layout.tsx` (importa o CSS, renderiza `<div className="pn-raiz" data-tema="claro">` com o `<script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />` logo após o contêiner aberto e os filhos dentro), `Casca` (barra lateral grafite: marca com o símbolo SVG do modelo + "Opus SoftWorks", `MenuLateral`, usuário com inicial e "Sair"; barra superior com `AlternarTema` e `acaoTopo`; no celular a lateral vira faixa horizontal) e `MenuLateral` (ícones SVG do modelo, item ativo com barra coral, grupo "Em breve" esmaecido, grupo "Administração" com Membros só para admin; mesmos links, `aria-current`, `aria-disabled`).
- [ ] **Step 5: Rodar `pnpm test`, `pnpm build`, `pnpm check:painel-seo`** — passam. Confirmar que `out/` do site público (`index.html`) **não** inclui `painel.css` (o CSS só é referenciado pelas páginas do painel).
- [ ] **Step 6: Commit** — `feat(painel): fundação visual, tema claro/escuro, casca e menu`.

### Task 2: Cálculos do dashboard — `lib/painel/resumo.ts`

**Files:**
- Create: `lib/painel/resumo.ts`, `tests/painel/resumo.test.ts`

**Interfaces:**
- Consumes: `Projeto`, `MembroEquipe`, `StatusProjeto` de `lib/painel/projetos.ts`.
- Produces: `type ResumoPainel = { total: number; emAndamento: number; emRevisao: number; porStatus: Record<StatusProjeto, number>; atrasados: Array<Projeto & { diasDeAtraso: number }>; entregasEm7Dias: number; proximaEntrega: Projeto | null; proximosPrazos: Array<{ projeto: Projeto; quando: string; atrasado: boolean }>; entregasPorSemana: Array<{ inicio: string; rotulo: string; total: number; atual: boolean }>; cargaPorPessoa: Array<{ id: string | null; nome: string; emAndamento: number; emRevisao: number; outros: number; total: number }>; agendaSemana: Array<{ data: string; diaSemana: string; hoje: boolean; projetos: Projeto[] }> }`; `resumirProjetos(projetos: Projeto[], equipe: MembroEquipe[], hoje: string): ResumoPainel`; utilitários puros exportados e testados: `somarDias(data: string, n: number): string`, `segundaDaSemana(data: string): string`, `diasEntre(a: string, b: string): number`, `textoRelativo(prazo: string, hoje: string): string` ("3 dias atrasado", "1 dia atrasado", "hoje", "amanhã", "em N dias"), `saudacao(hora: number): "Bom dia" | "Boa tarde" | "Boa noite"` (5–11, 12–17, resto).
- Regras: aberto = status ≠ `concluido`; `nome` da pessoa = e-mail (parte antes de `@`, primeira letra maiúscula) e linha "Sem responsável" (`id: null`) para projeto sem responsável **ou** com responsável que não está na equipe; semana começa na segunda; `entregasPorSemana` = 6 semanas a partir da semana atual, `rotulo` no formato `"19 out"`; `proximosPrazos` = até 5 abertos com prazo, vencidos primeiro e depois por data crescente.

- [ ] **Step 1: Testes que falham** (`tests/painel/resumo.test.ts`, node), com datas fixas e projetos fictícios: `somarDias` — `"cruza mês"`, `"cruza ano (31 dez + 1)"`, `"ano bissexto 28 fev 2028 + 1 = 29 fev"`; `segundaDaSemana` — domingo→segunda anterior, segunda→ela mesma, quarta→segunda; `diasEntre`; `textoRelativo` — 4 formas + singular/plural; `saudacao` — 4, 11, 12, 17, 18 horas; `resumirProjetos`: `"lista vazia devolve zeros e listas vazias, sem NaN"`, `"concluídos nunca entram em atrasados, entregas, carga ou agenda"`, `"prazo igual a hoje não é atrasado e entra em entregasEm7Dias"`, `"prazo em hoje+6 entra e hoje+7 não"`, `"atrasados ordenados do mais vencido, com diasDeAtraso"`, `"proximosPrazos: no máximo 5, vencidos primeiro"`, `"entregasPorSemana: 6 semanas, semana atual marcada, domingo conta na semana que termina nele"`, `"virada de ano: semanas após 29 dez rotuladas corretamente"`, `"cargaPorPessoa separa em andamento/revisão/outros e soma total"`, `"responsável ausente da equipe vira 'Sem responsável'"`, `"agendaSemana tem 7 dias de segunda a domingo e marca hoje"`, `"porStatus tem as 5 chaves mesmo com zero"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** as funções acima em `lib/painel/resumo.ts` (puras, sem `Date` local: aritmética de calendário com `Date.UTC`).
- [ ] **Step 4: Rodar `pnpm test`** — passam.
- [ ] **Step 5: Commit** — `feat(painel): cálculos do dashboard (resumo de projetos)`.

### Task 3: Gráficos e visão geral do dashboard

**Files:**
- Create: `components/painel/graficos.tsx`, `components/painel/visao-geral-view.tsx`, `tests/painel/graficos.test.tsx`
- Modify: `app/painel/page.tsx`, `tests/painel/visao-geral.test.tsx`

**Interfaces:**
- Consumes: `resumirProjetos`, `ResumoPainel`, `saudacao` (Task 2); `listarProjetos`, `listarEquipe`, `hojeEmSaoPaulo` (de `lib/painel/projetos.ts`); `<Guarda>`, `<Casca>` (Task 1), `useAcesso`, `mensagemDeErro`.
- Produces (`graficos.tsx`): `<BarrasSemanais semanas={ResumoPainel["entregasPorSemana"]} />` (SVG, `role="img"` com `aria-label` listando semana e total; barra da semana atual em coral; tudo zero → eixo e mensagem "Nenhuma entrega prevista"); `<CargaPorPessoa pessoas={ResumoPainel["cargaPorPessoa"]} />` (barras empilhadas, largura = fração do total da própria pessoa; total 0 → barra vazia, sem `NaN`; legenda Em andamento/Em revisão/Planejado e pausado); `<Anel fracao={number} />` (fração clampeada a 0–1, `aria-hidden`).
- Produces (`visao-geral-view.tsx`): `<VisaoGeralView resumo={ResumoPainel} saudacao={string} />` **puramente de apresentação** (sem I/O), com: saudação e data; faixa de atenção coral **só se `atrasados.length > 0`** com link "Ver projetos" para `/painel/projetos`; 4 indicadores (Em andamento com `<Anel>` e "N% da carteira" quando `total > 0`, Prazo vencido em coral, Entregas em 7 dias com a próxima, Em revisão); "Entregas por semana"; "Carga por pessoa"; "Agenda da semana" (7 dias, hoje destacado, até 2 projetos por dia e "+N"); "Próximos prazos"; três cartões tracejados "em breve" (Clientes e comercial, Financeiro, Campanhas). Estado vazio (`total === 0`): chamada "Crie o primeiro projeto" com link para `/painel/projetos?novo=1`.
- Produces (`app/painel/page.tsx`): dentro de `<Guarda>`, carrega projetos e equipe **uma vez** (contador de requisição contra resposta antiga; falha de projetos → alerta mapeado + "Tentar novamente"; falha só da equipe → dashboard sem carga por pessoa, com aviso discreto), mostra "Carregando…" (`role="status"`), e usa `<Casca acaoTopo={<Link href="/painel/projetos?novo=1">Novo projeto</Link>}>`.

- [ ] **Step 1: Testes que falham** em `tests/painel/graficos.test.tsx`: `"BarrasSemanais: aria-label lista as 6 semanas e totais"`, `"BarrasSemanais: semana atual em coral (classe pn-barra-atual)"`, `"BarrasSemanais: tudo zero mostra 'Nenhuma entrega prevista' e não quebra"`, `"CargaPorPessoa: larguras proporcionais ao total da pessoa e sem NaN com total 0"`, `"CargaPorPessoa: lista 'Sem responsável' quando existir"`, `"Anel: fração fora de 0–1 é limitada"`. Em `tests/painel/visao-geral.test.tsx` (atualizar o existente, preservando suas asserções úteis): `"mostra saudação, 4 indicadores e blocos"`, `"faixa de atenção aparece só com atrasados e linka para /painel/projetos"`, `"sem projetos mostra a chamada para criar o primeiro"`, `"falha ao carregar mostra alerta mapeado e Tentar novamente"`, `"falha só da equipe mantém o dashboard"`, `"resposta antiga não sobrescreve a nova"` (promessas diferidas), `"Novo projeto na barra superior aponta para /painel/projetos?novo=1"`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** os gráficos (SVG simples e acessível, estilos `pn-*` do CSS), `VisaoGeralView`, e a página; completar `painel.css` com o que faltar.
- [ ] **Step 4: Rodar `pnpm test`, `pnpm build`, `pnpm check:painel-seo`** — passam.
- [ ] **Step 5: Commit** — `feat(painel): visão geral com indicadores, gráficos e agenda`.

### Task 4: Projetos — lista em linhas, busca e formulário em gaveta

**Files:**
- Create: `components/painel/gaveta.tsx`, `tests/painel/gaveta.test.tsx`
- Modify: `components/painel/projeto-form.tsx`, `app/painel/projetos/page.tsx`, `tests/painel/projetos-page.test.tsx`

**Interfaces:**
- Produces (`gaveta.tsx`): `<Gaveta aberta={boolean} titulo={string} bloqueada={boolean} onFechar={() => void} acionador?: React.RefObject<HTMLElement | null>>{children}</Gaveta>` — renderiza `role="dialog"` `aria-modal="true"` `aria-labelledby` (título), fundo clicável; ao abrir foca o primeiro campo focável; `Esc` e clique no fundo chamam `onFechar` **somente se `!bloqueada`**; ao fechar devolve o foco ao `acionador` (ou ao elemento que tinha foco antes de abrir); bloqueia rolagem do corpo só enquanto aberta; transição desligada com `prefers-reduced-motion`; não renderiza conteúdo quando fechada.
- Consumes: tudo que a página de projetos já usa (Task 3 da entrega anterior); `ProjetoForm` mantém props `inicial`, `equipe`, `salvando`, `onSalvar`, `onCancelar`, `erro` e textos/labels atuais, mudando só a apresentação (classes `pn-*`, grade de 2 colunas para tipo/status e prazo/responsável).
- Página: cabeçalho com "Projetos" e a contagem ("N projetos · M com prazo vencido"); botão "Novo projeto"; controle segmentado de status (Todos + os 5, `role="group"`, botões com `aria-pressed`); campo de busca rotulado ("Buscar por nome ou cliente", filtro no cliente, ignora acentos/caixa); lista em linhas no padrão do modelo (nome + cliente, tipo, prazo com "atrasado", ponto de status, responsável com inicial, "Editar", "Apagar" só admin em dois passos); formulário dentro de `<Gaveta>` (título "Novo projeto" / "Editar projeto"); ao carregar com `?novo=1` na URL a gaveta abre vazia (lida no efeito, sem quebrar o prerender); bloco Equipe no padrão do modelo; todos os estados atuais preservados.

- [ ] **Step 1: Testes que falham** em `tests/painel/gaveta.test.tsx`: `"fechada não renderiza o diálogo"`, `"aberta tem role dialog, aria-modal e rótulo pelo título"`, `"foca o primeiro campo ao abrir"`, `"Esc fecha"`, `"clique no fundo fecha"`, `"Esc e fundo NÃO fecham quando bloqueada"`, `"devolve o foco ao acionador ao fechar"`. Em `tests/painel/projetos-page.test.tsx` (atualizar o existente sem remover asserções): `"filtro segmentado marca aria-pressed e filtra"`, `"busca ignora acentos e caixa e filtra por cliente"`, `"?novo=1 abre a gaveta vazia"`, `"abrir Editar de outro projeto não herda valores do anterior"`, `"Cancelar e Esc ficam bloqueados enquanto salva"`, `"contagem do cabeçalho mostra projetos e vencidos"`; e os testes atuais (carga/erro/vazio/duplo envio/Apagar admin/dois passos/resposta antiga) continuam passando.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** `Gaveta`, a refatoração visual de `ProjetoForm` e da página (lógica de carga/salvamento/exclusão inalterada).
- [ ] **Step 4: Rodar `pnpm test`, `pnpm build`, `pnpm check:painel-seo`** — passam.
- [ ] **Step 5: Commit** — `feat(painel): lista de projetos em linhas, busca e formulário em gaveta`.

### Task 5: Login e Membros no novo padrão + verificação visual

**Files:**
- Modify: `app/painel/entrar/page.tsx`, `app/painel/membros/page.tsx`, `components/painel/guarda.tsx` (apenas apresentação das telas de carregando/sem acesso/sem permissão/não configurado), `tests/painel/entrar.test.tsx`, `tests/painel/membros-page.test.tsx`, `tests/painel/guarda.test.tsx` (somente se o DOM mudar)
- Create (temporário, **não commitar**): `app/painel/__previa/page.tsx` e `components/painel/__previa-dados.ts` para renderizar as telas com dados fictícios; remover antes do commit final.

**Interfaces:**
- Consumes: classes `pn-*` e componentes das Tasks 1–4.

- [ ] **Step 1: Testes** (atualizar sem remover asserções): login — marca, botão "Entrar com Google", mensagens fixas de erro e desabilitado em "não configurado" continuam; membros — lista no padrão de linhas, formulário de adicionar, desativar bloqueado na própria linha, mensagens mapeadas continuam; guarda — textos "Você não tem acesso a este painel", "Painel ainda não configurado", "Carregando…" continuam.
- [ ] **Step 2: Implementar** a apresentação no padrão do modelo (login: cartão centralizado sobre o fundo do tema, símbolo da marca; membros: tabela/linhas como projetos).
- [ ] **Step 3: Verificação visual** (obrigatória): com a rota de prévia temporária servindo dados fictícios (visão geral cheia, visão geral vazia, projetos com gaveta aberta, membros, login), capturar telas no navegador do app em **1280 px** (claro e escuro) e **360 px**, comparar com `docs/design/painel-modelo-v2.html` e corrigir diferenças relevantes de espaçamento, hierarquia, cor e quebra de linha; conferir que não há rolagem horizontal em 360 px (`document.documentElement.scrollWidth <= clientWidth`). Anexar as capturas ao relatório. **Remover os arquivos `__previa*` antes do commit.**
- [ ] **Step 4: Rodar `pnpm test`, `pnpm build`, `pnpm check:painel-seo`** — passam; `git status` não mostra arquivos de prévia.
- [ ] **Step 5: Commit** — `feat(painel): login e membros no novo visual; ajustes finais`.
