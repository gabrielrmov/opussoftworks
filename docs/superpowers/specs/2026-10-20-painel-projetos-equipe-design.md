# Painel interno — Módulo "Projetos e equipe" (subprojeto 2)

Data: 2026-10-20 · Status: aprovada pelo Gabriel (desenho nas duas partes; execução autorizada)

## Objetivo

Substituir o cartão "em breve" de **Projetos e equipe** por um módulo real: uma lista dos
projetos que a Opus está tocando (sites, sistemas, tráfego), com status, prazo e responsável,
mais uma lista da equipe. É a **primeira tabela de dados** do painel e fixa o padrão que os
módulos seguintes (Clientes, Financeiro, Campanhas) vão repetir.

Contexto confirmado com o Gabriel:

- Foco desta versão: **lista de projetos** (sem tarefas, sem quadro, sem carga da equipe).
- Uso interno de Gabriel e Rafael; dados **digitados à mão**, sem integração.
- **Permissões:** todo membro ativo vê, cria e edita projetos; só **admin** apaga.
- O **cliente** é **texto livre** por enquanto; ligar ao módulo Clientes é um passo futuro.
- Construído sobre a base já no ar (spec `2026-10-13-painel-base-segura-design.md`):
  login Google, tabela `membros`, funções `eh_membro()`/`eh_admin()`, Guarda, Casca.

## Restrições do ambiente

- Site estático (`output: "export"`), sem servidor Next: **a barreira real é o banco** (RLS).
- Repositório público: nada sensível no código; os dados ficam só no Supabase.
- A tabela é criada pelo SQL Editor do Supabase (não há CLI/CI de migração). As migrações
  ficam versionadas em `supabase/migrations/` e são testadas num Postgres embutido (PGlite).
- Lições já aprendidas no módulo de membros, que valem aqui: um `update`/`delete` que o RLS
  filtra devolve zero linhas **sem erro** (a tela não pode tratar como sucesso); nunca exibir
  texto cru do banco; e-mail/texto sempre normalizado antes de gravar.

## Dados

### Migração `0004_privilegios_padrao.sql` — o "portão obrigatório"

Antes da primeira tabela de dados. No Supabase, tabelas novas nascem com `TRUNCATE`,
`REFERENCES`, `TRIGGER` para `anon` e `authenticated` (o RLS não barra `TRUNCATE`) e `ALL` para
`anon`. A migração muda os **privilégios padrão** do schema `public` para o papel `postgres`:

- revogar `truncate`, `references`, `trigger` em tabelas futuras de `anon` e `authenticated`;
- revogar todos os privilégios em tabelas futuras de `anon`;
- revogar `execute` em funções futuras de `anon`. Isso remove só o grant **direto** de `anon`:
  por padrão do Postgres, funções novas ainda nascem executáveis por `PUBLIC`, então cada função
  nova deve revogar `execute` de `public, anon` explicitamente (como a 0005). Um revoke global de
  `PUBLIC` foi rejeitado por afetar extensões e outros schemas.

Não altera objetos que já existem (`membros` já foi endurecida na migração 0003).

### Migração `0005_projetos.sql`

Tabela `public.projetos`:

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `nome` | `text` | obrigatório, 1–120 caracteres após `btrim` |
| `cliente` | `text` | obrigatório, 1–120 caracteres após `btrim` (texto livre) |
| `tipo` | `text` | `site` \| `sistema` \| `trafego` \| `outro` |
| `status` | `text` | `planejado` \| `em_andamento` \| `em_revisao` \| `pausado` \| `concluido`; padrão `planejado` |
| `prazo` | `date` | opcional |
| `responsavel_id` | `uuid` | opcional, `references membros(id) on delete set null` |
| `observacoes` | `text` | opcional, até 2000 caracteres |
| `criado_em` | `timestamptz` | padrão `now()` |
| `atualizado_em` | `timestamptz` | padrão `now()`, atualizado por gatilho `BEFORE UPDATE` |

Índices em `status` e `prazo`. Os textos obrigatórios têm `check` contra string vazia ou só
espaços.

**Acesso (RLS ligado e forçado):**

- `select`, `insert`, `update`: `to authenticated`, `using`/`with check` = `public.eh_membro()`.
- `delete`: `to authenticated`, `using` = `public.eh_admin()`.
- Nenhum acesso para `anon`. Revogações explícitas na própria migração (`truncate`,
  `references`, `trigger` de `anon, authenticated`; tudo de `anon`), além do padrão da 0004.

**Equipe:** função `public.equipe() returns table (id uuid, email text, papel text)`,
`security definer`, `set search_path = public`, devolve os membros **ativos** ordenados por
e-mail **somente se** `public.eh_membro()` for verdadeiro (senão, vazio). Execução revogada de
`public`/`anon` e concedida só a `authenticated`. Motivo: um membro comum só lê a própria linha
de `membros`, então não conseguiria escolher outra pessoa como responsável.

## Telas

- **Menu e visão geral:** "Projetos e equipe" vira link real para `/painel/projetos`; o cartão da
  visão geral mostra "N em andamento" (contagem de `status = 'em_andamento'`); se a contagem
  falhar, mostra "—".
- **`/painel/projetos`** (dentro de `<Guarda>` e `<Casca>`, como as demais):
  - lista com nome, cliente, tipo, status, prazo e responsável, ordenada por prazo crescente
    (sem prazo no fim) e depois por nome; filtro por status; no celular a lista vira cartões;
  - **atrasado:** prazo anterior à data de hoje (calculada no fuso `America/Sao_Paulo`) e status diferente de
    `concluido` mostra o texto "atrasado" (não só cor);
  - **criar e editar:** botão "Novo projeto" abre um formulário (nome, cliente, tipo, status,
    prazo, responsável, observações) e a mesma tela edita; o responsável é escolhido entre os
    membros ativos (via `equipe()`); campos rotulados e utilizáveis por teclado;
  - **apagar:** botão visível só para admin, com confirmação em dois passos no próprio item
    (sem `window.confirm`);
  - **equipe:** bloco só de leitura com os membros ativos (e-mail e papel);
  - estados: carregando, vazio ("Nenhum projeto ainda"), erro.
- Visual no padrão da marca (coral `#FF6039` só como destaque, grafite `#161616`, fundo
  `#FAFAFA`, Inter Tight; sem gradiente, brilho ou selos); textos em pt-BR.

## Código

- `lib/painel/erros.ts` (novo): a função de mensagem de erro hoje em `lib/painel/membros.ts` é
  extraída para um módulo compartilhado e reutilizada pelos dois módulos (refatoração
  pequena e necessária para não duplicar). Mapeamentos: violação de unicidade, último admin,
  permissão (`42501`, "permission denied", "row-level security"), painel não configurado,
  violação de `check` (valor inválido) e genérico; o texto cru nunca aparece.
- `lib/painel/projetos.ts` (novo): tipos `Projeto`, `DadosProjeto`, `StatusProjeto`,
  `TipoProjeto`; funções `listarProjetos()`, `criarProjeto(dados)`, `atualizarProjeto(id, dados)`,
  `apagarProjeto(id)`, `listarEquipe()`, `contarEmAndamento()`, e o utilitário puro
  `estaAtrasado(projeto, hoje)`. `atualizarProjeto` e `apagarProjeto` encadeiam `.select("id")` e
  tratam **zero linhas** como erro de permissão. Validação antes de tocar o banco: textos com
  `trim`, tamanhos máximos, tipo e status dentro da lista; erro em português.
- `components/painel/projeto-form.tsx` (novo): formulário reutilizado para criar e editar.
- `app/painel/projetos/page.tsx` (novo); ajustes em `components/painel/menu-lateral.tsx` e
  `app/painel/page.tsx`; a lista de áreas duplicada nesses dois arquivos passa a uma constante
  única.

## Testes

- **Banco (PGlite, em `tests/db/`)**: visitante, e-mail de fora e membro revogado não leem nem
  escrevem; membro ativo cria, lê e edita; membro comum **não** apaga e a tentativa afeta zero
  linhas; admin apaga; `TRUNCATE` negado; `tipo`/`status` inválidos, textos vazios ou só espaços e
  textos acima do limite recusados; `atualizado_em` muda no update; apagar um membro zera
  `responsavel_id`; `equipe()` devolve só membros ativos e **vazio** para quem não é membro e é
  inexecutável por `anon`; **a 0004 funciona**: uma tabela criada depois dela nasce sem
  `TRUNCATE`/`REFERENCES`/`TRIGGER` para `authenticated` e sem nenhum privilégio para `anon`.
- **Biblioteca e telas (Vitest + jsdom)**: validação e normalização; mapeamento de erros sem
  vazar texto cru; zero linhas vira erro; `estaAtrasado` com data injetada (hoje, ontem,
  amanhã, concluído, sem prazo); página com lista, filtro, vazio, erro, formulário (campos
  obrigatórios, responsável), botão de apagar escondido para `membro` e visível para `admin`,
  confirmação em dois passos.

## Entrega

- Branch `feat/painel-projetos`, a partir de `redesign` (que é o que publica o site).
- **Ordem na produção:** primeiro o Gabriel aplica `0004` e `0005` no SQL Editor do Supabase
  (nada quebra, a tela antiga não usa a tabela); depois o código é publicado. O runbook
  (`docs/painel-setup.md`) ganha o passo e a convenção para os próximos módulos.
- O PostgREST recarrega o esquema sozinho ao criar a função `equipe()`; se a chamada falhar
  logo após, esperar alguns segundos.

## Fora do escopo desta versão

Tarefas e quadro; valores, cobrança e contratos (módulo Financeiro); ligação com a tabela de
clientes (módulo Clientes e comercial); anexos; histórico de alterações; notificações; carga de
trabalho da equipe; exportação.

## Riscos e pontos de atenção

- **Primeira tabela de dados:** se a 0004 não for aplicada antes, `TRUNCATE` ficaria exposto a
  `authenticated`; por isso a 0005 também revoga explicitamente (defesa em duas camadas). Os privilégios
  padrão (0004) são testados; os revokes explícitos da 0005 são cinto e suspensório e não
  têm teste separado.
- **`ALTER DEFAULT PRIVILEGES ... FOR ROLE postgres`:** só afeta objetos criados por `postgres`
  (o papel do SQL Editor). Objetos criados por outro papel não herdam; documentado no runbook.
- **Funções novas:** os privilégios padrão não tiram `PUBLIC`; toda função nova precisa de `revoke execute ... from public, anon` na própria migração.
- **Responsável como chave para `membros`:** apagar um membro deixa o projeto sem responsável
  (não apaga o projeto).
- **Fuso do "atrasado":** a data de "hoje" é calculada com `Intl` no fuso `America/Sao_Paulo`,
  independentemente do fuso do navegador; `prazo` é uma data sem horário, então um prazo é
  considerado vencido a partir do dia seguinte.

## Próximos subprojetos (ordem sugerida)

Clientes e comercial (e então ligar `projetos.cliente` a um cliente), Financeiro, Campanhas.
