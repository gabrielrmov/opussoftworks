# Opus Leads (extensão do Chrome)

Encontra empresas no Google Maps e mostra, para cada uma: telefone/WhatsApp, Instagram, site (e se está no ar), plataforma do site e se já faz tráfego pago.

## Instalar
1. Abra `chrome://extensions` e ative o **Modo do desenvolvedor**.
2. **Carregar sem compactação** → selecione esta pasta (`chrome-extension/`).
3. Fixe o ícone da Opus na barra. Clicar nele abre o painel lateral do Chrome, que continua aberto ao trocar de aba; para mudar a largura, arraste a borda do painel.

## Usar
1. Pesquise no Google Maps (ex: "dentista em Curitiba").
2. Clique em **Buscar leads nesta pesquisa**. A extensão lê até 100 empresas e analisa o site de cada uma em segundo plano.
3. Clique em **sem site** ou **sem tráfego** no topo para filtrar os leads mais quentes e **Exportar planilha**.

Fora do Maps, o botão vira **Analisar esta página** (site, Instagram ou link na bio da empresa).

## O que é detectado
- **Contatos**: telefone, WhatsApp, e-mail, Instagram, Facebook, TikTok, LinkedIn, YouTube (do Maps, da home e da página de contato).
- **Site**: sem site, só rede social, fora do ar, no ar + plataforma (WordPress, Wix, Shopify, Nuvemshop…).
- **Tráfego pago**: anúncio patrocinado no Maps, Pixel Meta, tag Google Ads e Pixel TikTok (também dentro do GTM). A planilha traz o link da Biblioteca de Anúncios da Meta para conferir.

## Prospecção automática pelo WhatsApp (WA-AKG)
1. No painel do seu WA-AKG, crie uma sessão para o número da Opus (ex: `opus`), leia o QR code e gere uma chave de API.
2. Na extensão, clique na engrenagem e preencha endereço https, sessão e chave. Use **Testar conexão**.
3. Ajuste as mensagens se quiser. A extensão escolhe sozinha: **sem site**, **sem tráfego pago** ou **os demais**. Variáveis: `{saudacao}` (bom dia/boa tarde/boa noite pelo horário do envio), `{nome}` (nome curto da empresa), `{empresa}` (com o artigo certo: "da Fama Odonto", "do Restaurante X"), `{apresentacao}` (usa o campo **Seu nome** e muda por vertente), `{instagram}` (o @ achado no site), `{categoria}`.
4. Selecione os leads clicando no card (ou **Selecionar todos com WhatsApp**). No rodapé, escolha a **vertente** do envio: **Sites e tráfego**, **Locarion** ou **Videomaker**. Cada vertente tem as próprias mensagens, que você edita na engrenagem (aba da vertente).

### Vertente Locarion (vender o sistema para locadoras)
1. No Maps, pesquise por exemplo `locadora de equipamentos para construção em Goiânia`. Repita com `aluguel de andaimes` e `locação de máquinas para obra` para achar mais.
2. Os leads ganham a etiqueta **locadora de obra** (categoria ou nome com construção, andaime, betoneira, escora, máquinas…) ou **locadora a confirmar** (locadora genérica). Carro, moto, festa, imóvel e afins ficam sem etiqueta. O filtro **locadoras** mostra só os dois primeiros grupos.
3. Selecione, clique em **Locarion** e confirme. Locadora de obra recebe a mensagem direta sobre o sistema; a "a confirmar" recebe antes a pergunta se aluga equipamento de obra.
4. Cada lead guarda a vertente enviada (aparece no card e na planilha) e nunca recebe uma segunda mensagem, de nenhuma vertente.

### Pesquisa automática de leads (Videomaker)
Em vez de pesquisar no Maps à mão, clique em **Pesquisar leads de vídeo**, informe a **cidade** e marque os **nichos** (restaurante, clínica de estética, academia, pousada, imobiliária… ou adicione outro, como advocacia). A extensão abre uma aba do Maps em primeiro plano, pesquisa "nicho em cidade" um de cada vez (até 40 empresas por nicho, com pausa entre eles), analisa os sites e fecha a aba no fim. Dá para **Parar** a qualquer momento. Ao terminar, a lista mostra só os qualificados.

### Qualificação: mensagem só para os melhores leads
Cada lead recebe uma pontuação de 0 a 100 **por vertente** (etiquetas ★ no card; passe o mouse para ver os motivos). Lead sem celular fica limitado a 40 pontos e nunca passa. O mínimo padrão é 60.
- **Videomaker:** reputação (nota), nº de avaliações, celular, Instagram, site no ar, já anuncia e nicho que vive de imagem.
- **Locarion:** ser locadora de obra (decisivo: quem não é locadora de equipamento tem 0), celular, avaliações, nota, site e Instagram.
- **Sites e tráfego:** celular, não ter site (ou estar fora do ar), não anunciar, nota e avaliações.

Ao clicar em um botão de envio, só os selecionados qualificados para **aquela vertente** recebem; a confirmação diz quantos ficaram de fora. Na engrenagem, em **Quem recebe**, dá para mudar a pontuação mínima ou desligar a regra. O botão **★ Só qualificados** filtra a lista.

### Vertente Videomaker (oferecer vídeo)
1. No Maps, pesquise negócios que vivem de imagem, por exemplo `restaurante`, `clínica de estética`, `academia`, `pousada`, `imobiliária`, `barbearia` + cidade.
2. Selecione e clique em **Videomaker**. A apresentação vira "Meu nome é X, sou videomaker" (campo **Seu nome** na engrenagem), sem citar a Opus.
3. Quem tem Instagram achado no site recebe a mensagem que cita o @ da empresa; os demais recebem a geral, sobre reels, vídeo institucional e conteúdo para redes. As duas são editáveis na aba **Videomaker**.

### Sem Google Cloud: WA-AKG no próprio Mac
Se não quiser manter servidor na nuvem (nem conta de faturamento), rode o WA-AKG no Mac, em `http://localhost:3000`. O Mac precisa estar ligado e acordado durante os envios (o Chrome também, por causa da fila).
1. Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/) (versão "Apple chip") e abra-o uma vez.
2. No Terminal: `bash /Users/macdegabriel/Projetos/opussoftworks/chrome-extension/servidor-local/iniciar.sh`. O primeiro build leva de 5 a 15 minutos; o login do painel aparece no fim (e fica em `~/wa-akg-local/.env`).
3. Abra `http://localhost:3000`, entre, crie a sessão e leia o QR code, como no passo da nuvem.
4. Na extensão, use `http://localhost:3000` como endereço do servidor.
5. Para religar depois de reiniciar o Mac: abra o Docker Desktop (os contêineres sobem sozinhos) ou rode o `iniciar.sh` de novo. Para o Mac não dormir durante os envios: `caffeinate -dimsu`.

### Um número para cada vertente
O WA-AKG aceita vários números no mesmo servidor, cada um como uma sessão. O **número padrão** (Opus) envia **Sites e tráfego** e **Locarion**; para o **Videomaker** use outro:
1. No painel do WA-AKG, crie uma sessão nova (ex: `Videomaker`) e leia o QR code com o WhatsApp do outro chip. Uma chave de API serve para todas as sessões.
2. Na engrenagem, preencha endereço e chave (as sessões aparecem nas listas), vá na aba **Videomaker** e em **Número que envia esta vertente** escolha a sessão nova.
3. **Testar conexão** confere se todos os números usados existem e estão conectados. A confirmação de envio mostra qual número vai enviar.

O limite por dia vale **por número**: o Videomaker batendo o limite dele não segura os envios da Opus.

A fila roda no background, mesmo com a extensão fechada (o Chrome precisa ficar aberto): um envio a cada 1 a 2,5 min, até 40 por dia por número; no limite, pausa e continua no dia seguinte às 9h. Antes de enviar, confere no WA-AKG se o número tem WhatsApp (com e sem o 9). Lead já contatado nunca recebe de novo. Se a chave ou a sessão falharem, a fila para e mostra o erro.

> **Risco:** o WA-AKG usa uma biblioteca não oficial do WhatsApp e mensagem para quem não salvou seu número pode levar a bloqueio. Comece com poucos envios por dia, use um número que você possa perder e respeite quem pedir para não receber mais.

## Observações
- Em anúncios do Maps o botão "Website" passa pelo link pago do Google; a extensão não abre esse link (não gera clique cobrado), então o site desses leads não é analisado.
- O Maps muda o HTML com frequência; os seletores ficam em `extractors.js` e a análise de site em `background.js`.
- Raspar o Maps vai contra os termos do Google. Use em volume moderado.
