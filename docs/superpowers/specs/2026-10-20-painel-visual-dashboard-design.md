# Painel interno — Redesenho visual e dashboard da visão geral

Data: 2026-10-20 · Status: aprovada pelo Gabriel (modelo visual v2 aprovado: "muito melhor";
execução autorizada: "faz tudo, só me entrega pronto")

## Objetivo

O painel funciona, mas a interface está crua (caixas brancas, cartões "Em breve"). Esta entrega
dá ao painel o **visual e a estrutura de um dashboard de controle**: nova casca (barra lateral +
barra superior), tema claro/escuro, visão geral com indicadores e gráficos calculados a partir
dos dados que **já existem** (projetos e equipe), lista de projetos redesenhada e formulário em
gaveta lateral. Nenhum dado novo é criado: **nenhuma migração de banco**.

**Referência visual aprovada:** `docs/design/painel-modelo-v2.html` (abrir no navegador; clicar em
"Projetos e equipe" e em "Novo projeto"/"Editar"; botão de lua alterna o tema). O modelo manda
em proporções, hierarquia, cores e espaçamentos; este documento manda no comportamento.

## Decisões

- **Marca:** coral `#FF6039` como destaque raro, grafite `#161616`, fundos neutros quentes,
  fonte Inter Tight (já carregada globalmente). Sem gradientes decorativos, brilhos ou selos.
- **Tema claro e escuro:** claro por padrão; o botão na barra superior alterna e **lembra** a
  escolha (localStorage, com tratamento de falha/privacidade); aplicado antes da pintura para não
  piscar. Escopo **só do painel** (um contêiner com `data-tema`), sem afetar o site público.
- **Estilo por CSS escopado:** um arquivo `app/painel/painel.css` com variáveis de tema e classes
  com prefixo `pn-`, importado só pelo layout do painel. Os componentes usam essas classes.
- **Textos estáveis:** os textos de interface já existentes ("Novo projeto", "Salvar", "Cancelar",
  "Apagar", "Nenhum projeto ainda.", "Tentar novamente", "Sair", etc.) não mudam, para preservar
  os testes e o comportamento.
- **Itens do modelo que NÃO entram** (não funcionam hoje e seriam enganosos): busca global
  (⌘K) e sino de notificações. A **busca por nome/cliente** entra, mas só na página de Projetos,
  funcionando de verdade (filtro no cliente).
- **Saudação:** "Bom dia/Boa tarde/Boa noite" pelo horário de São Paulo, **sem nome** (a tabela
  de membros não tem nome; o e-mail aparece no rodapé da barra lateral).
- **"Concluídos no mês" fica de fora:** seria impreciso (depende de `atualizado_em`). O quarto
  indicador é **"Em revisão"**, que é exato.

## Dados e cálculos (`lib/painel/resumo.ts`, funções puras, sem I/O)

Entrada: `Projeto[]`, `MembroEquipe[]`, `hoje: string` (`YYYY-MM-DD`, fuso São Paulo). Semana
começa na **segunda**. Projeto "aberto" = status ≠ `concluido`. Saída (`ResumoPainel`):

- `total`, `emAndamento`, `emRevisao`, `porStatus` (contagem por cada um dos 5 status);
- `atrasados`: projetos abertos com `prazo < hoje`, mais vencido primeiro, com `diasDeAtraso`;
- `entregasEm7Dias`: abertos com `hoje <= prazo <= hoje+6`; `proximaEntrega` (a mais próxima);
- `proximosPrazos`: até 5 abertos com prazo, vencidos primeiro e depois por data, com texto
  relativo ("3 dias atrasado", "hoje", "amanhã", "em N dias");
- `entregasPorSemana`: 6 semanas a partir da **semana atual**, contagem de abertos com prazo em
  cada uma (rótulo = data da segunda, ex.: "19 out"); a semana atual é marcada;
- `cargaPorPessoa`: por membro da equipe, abertos atribuídos separados em `emAndamento`,
  `emRevisao` e `outros` (planejado/pausado); projetos sem responsável ou com responsável fora da
  equipe ativa entram numa linha "Sem responsável"; ordenada por total decrescente;
- `agendaSemana`: 7 dias da semana atual (segunda a domingo), cada um com a lista de projetos
  abertos com prazo naquele dia (e marca de "hoje").

## Telas

- **Casca (`Casca`):** barra lateral grafite (marca com o símbolo, navegação com ícones e item
  ativo com barra coral, grupo "Em breve" esmaecido, "Administração" com Membros para admin,
  usuário e "Sair" no rodapé) + barra superior (alternância de tema e atalho "Novo projeto").
  No celular a barra lateral vira uma faixa horizontal no topo.
- **Visão geral:** saudação; faixa de atenção coral **só se houver atrasados** (com "Ver
  projetos"); 4 indicadores (Em andamento, Prazo vencido em coral, Entregas em 7 dias, Em
  revisão); gráfico "Entregas por semana" (barras SVG); "Carga por pessoa" (barras empilhadas);
  "Agenda da semana"; "Próximos prazos"; três cartões tracejados "em breve". Estados:
  carregando, erro com "Tentar novamente", vazio (sem projetos) com chamada para criar o primeiro.
- **Projetos:** cabeçalho com contagem; filtro por status (controle segmentado) + busca por
  nome/cliente; lista em linhas com status como ponto de cor, prazo vencido em coral (texto
  "atrasado" sempre presente), responsável com inicial; **formulário em gaveta lateral**
  (`role="dialog"`, `aria-modal`, foco no primeiro campo ao abrir, Esc e clique no fundo fecham
  **exceto enquanto salva**, foco volta ao botão que abriu); bloco Equipe. Todo o comportamento
  atual permanece (guarda de resposta antiga, bloqueio de duplo envio, Apagar só para admin com
  confirmação em dois passos, erro de carga sem estado vazio falso).
- **Entrar e Membros:** mesmo sistema visual (cartão centralizado com a marca no login; tabela no
  padrão da lista de projetos em Membros), sem mudar o comportamento.

## Acessibilidade e responsividade

Contraste suficiente nos dois temas (texto/mudo/coral sobre os fundos); foco visível em todos os
controles; ícones decorativos com `aria-hidden`; gráficos com alternativa em texto (`role="img"` +
`aria-label` resumindo os valores); `prefers-reduced-motion` desliga a animação da gaveta;
layout funciona de 360 px a telas largas, sem rolagem horizontal da página.

## Testes

- `resumo.ts`: cobertura completa dos cálculos (limites de semana, virada de mês/ano, prazo = hoje,
  concluídos fora das contas, responsável ausente, lista vazia).
- Componentes: tema (alterna, persiste, tolera localStorage indisponível), gaveta (foco, Esc, fundo,
  bloqueio ao salvar), gráficos (rótulos e `aria-label`), visão geral (estados e conteúdo), lista
  de projetos (filtro, busca, ações) e os testes existentes **atualizados, nunca removidos**.
- `pnpm test`, `pnpm build` e `pnpm check:painel-seo` passam; sem mudança de banco.
- **Verificação visual:** as telas são renderizadas com dados fictícios numa rota de pré-visualização
  **temporária (não commitada)** e comparadas com o modelo em capturas de tela.

## Fora do escopo

Migrações; novos dados; busca global; notificações; nome de exibição do usuário; exportação;
gráficos de histórico (exigiriam dados que não guardamos).

## Riscos

- Muito CSS novo: escopo por prefixo `pn-` e contêiner do painel evitam vazar para o site público.
- Gaveta com foco e teclado é fácil de errar: cobertura de testes e revisão dedicadas.
- Semana/fuso: o cálculo usa datas `YYYY-MM-DD` em aritmética de calendário (UTC), sem depender do
  fuso do navegador, exceto para obter "hoje" (fuso São Paulo, já existente).
