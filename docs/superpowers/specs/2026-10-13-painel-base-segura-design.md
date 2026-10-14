# Painel interno da Opus SoftWorks — Base segura (subprojeto 1)

Data: 2026-10-13 · Status: aguardando revisão

## Objetivo

Uma área restrita em `opussoftworks.com.br/painel`, para uso interno da equipe, que será o
dashboard geral de controle da empresa. Só entra quem estiver numa lista de e-mails
autorizados. Este subprojeto entrega a **base segura** (login, autorização, esqueleto do
painel). Os dados reais de cada área entram em subprojetos seguintes.

Contexto confirmado com o Gabriel:

- Os dados serão **reais e sensíveis** (campanhas, clientes, financeiro, projetos).
- O painel cobre quatro áreas: **Campanhas / tráfego pago**, **Clientes e comercial**,
  **Financeiro**, **Projetos e equipe**.
- Login com **Google**, restrito a uma **lista de e-mails**.
- Abordagem escolhida: **dentro do próprio site + Supabase**.
- "Só quem tiver o link" é só o endereço de entrada. A proteção real é o login mais a lista.

## Restrições do ambiente

- O site é uma exportação estática do Next.js (`output: "export"`), publicada no GitHub Pages
  com domínio próprio. Não há servidor nem middleware, então **a tela não pode ser a barreira**.
- O repositório é público (temporariamente). O código das telas é visível; os dados não podem
  depender de esse código ser secreto.
- Este clone local estava no `main` antigo. O trabalho parte de `origin/redesign`
  (branch `feat/painel`), que é a versão publicada.

## Arquitetura de acesso

- **Páginas:** `/painel/entrar` (login) e `/painel/...` (área logada), como componentes de
  cliente no site estático.
- **Autenticação:** Supabase Auth com provedor Google.
- **Autorização:** tabela `membros` (`email`, `papel` = `admin` | `membro`, `ativo`).
  Gabriel e Rafael entram como `admin`.
- **Barreira real:** Row Level Security em toda tabela. Uma linha só é lida ou escrita por
  quem está autenticado **e** consta em `membros` com `ativo = true`. Quem logar com Google
  fora da lista não recebe nenhuma linha.
- **Contas fora da lista:** a criação de conta é bloqueada para e-mails que não estejam em
  `membros` (hook de pré-cadastro do Supabase), para não acumular contas inúteis.
- **Administração:** só `admin` adiciona ou revoga membros. Revogar vale imediatamente.
- **Segredos:** o site só contém a URL do Supabase e a chave pública (anon), públicas por
  desenho. Qualquer chave secreta (por exemplo, Meta Ads e Google Ads) fica apenas em
  funções do Supabase (Edge Functions), nunca no código do site.
- **Fora dos buscadores:** `/painel` com `noindex`, ausente do sitemap, com `Disallow` no
  `robots.txt` e sem nenhum link a partir do site público.

## Telas desta versão

- `/painel/entrar`: botão "Entrar com Google" e mensagens de erro (por exemplo, "sem acesso").
- `/painel`: visão geral, com um cartão por área; cada um mostra "em breve".
- Menu lateral: Visão geral, Projetos e equipe, Clientes e comercial, Financeiro, Campanhas e,
  só para `admin`, Membros.
- `/painel/membros` (admin): listar, adicionar e revogar e-mails.
- Visual no padrão da marca (coral, grafite, Inter Tight), simples, sem excesso de gradiente,
  brilho ou selos.

## Dados e migrações

- Tabela `membros` e as políticas de RLS ficam em `supabase/migrations/`, versionadas no
  repositório, sem segredos.
- Cada módulo futuro cria suas tabelas seguindo a mesma política de acesso.

## Testes

- Teste automatizado de RLS com três contas: autorizada (lê e escreve), fora da lista e
  revogada (não leem nem escrevem nada).
- Teste de que `membros` só é alterável por `admin`.
- Teste da tela: sem sessão, ou sem autorização, nenhum dado é exibido.
- Verificação de que `/painel` fica fora do sitemap e com `noindex` no HTML gerado.

## Entrega

- Branch `feat/painel`, a partir de `origin/redesign`.
- Deploy pelo workflow existente do GitHub Pages. A URL e a chave pública do Supabase entram
  como variáveis do workflow.
- **Ações do Gabriel** (guiadas passo a passo): criar o projeto no Supabase; criar o acesso
  OAuth no Google Cloud; informar a URL e a chave pública no GitHub.

## Fora do escopo desta versão

- Os quatro módulos de dados (Projetos e equipe, Clientes e comercial, Financeiro, Campanhas).
- Integrações com Meta Ads e Google Ads.
- Papéis por área (permissões finas por módulo); começa só com `admin` e `membro`.

## Riscos e pontos de atenção

- A segurança depende de as políticas de RLS estarem corretas; por isso os testes acima são
  obrigatórios antes de qualquer dado real entrar.
- Hospedagem: o GitHub Pages gratuito exige repositório público. Se o repo voltar a ser
  privado sem plano pago, o site sai do ar. O painel não muda isso, mas aumenta a razão para
  decidir a hospedagem definitiva.
- Todo dado real fica no Supabase; nada sensível entra no repositório nem no build.

## Próximos subprojetos (ordem sugerida)

1. Projetos e equipe.
2. Clientes e comercial, depois Financeiro.
3. Campanhas / tráfego pago (integrações com Meta e Google Ads).
