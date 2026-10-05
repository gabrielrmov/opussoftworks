// Conteúdo + ilustrações das 12 peças (feed 4:5, 1080x1350).
// Ilustrações em SVG (viewBox 600x480) usando variáveis de tema:
//   --fg texto, --mut texto secundário, --card superfície, --line borda, --acc cobalto.

const A = 'var(--acc)', C = 'var(--card)', F = 'var(--fg)', L = 'var(--line)', M = 'var(--mut)';

const funnel = `
<path d="M60 70H540L380 250V400L220 440V250Z" fill="${C}" stroke="${L}" stroke-width="3" stroke-linejoin="round"/>
<path d="M120 70H480L340 230H260Z" fill="${A}" opacity=".18"/>
${[110,190,270,350].map((x,i)=>`<circle cx="${x+i*8}" cy="${40+(i%2)*10}" r="14" fill="${M}" opacity=".6"/>`).join('')}
<circle cx="300" cy="150" r="11" fill="${A}" opacity=".5"/><circle cx="268" cy="190" r="9" fill="${A}" opacity=".5"/><circle cx="328" cy="200" r="9" fill="${A}" opacity=".5"/>
<circle cx="300" cy="345" r="26" fill="${A}"/><path d="M288 345l9 9 16-18" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<text x="300" y="470" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">CLIQUE → LEAD → CLIENTE</text>`;

const browser = `
<rect x="40" y="50" width="520" height="340" rx="22" fill="${C}" stroke="${L}" stroke-width="3"/>
<path d="M40 110H560" stroke="${L}" stroke-width="3"/>
<circle cx="76" cy="80" r="8" fill="${M}" opacity=".5"/><circle cx="104" cy="80" r="8" fill="${M}" opacity=".5"/><circle cx="132" cy="80" r="8" fill="${M}" opacity=".5"/>
<rect x="80" y="150" width="270" height="30" rx="15" fill="${F}"/>
<rect x="80" y="196" width="200" height="30" rx="15" fill="${F}" opacity=".55"/>
<rect x="80" y="250" width="330" height="16" rx="8" fill="${M}" opacity=".35"/><rect x="80" y="280" width="260" height="16" rx="8" fill="${M}" opacity=".35"/>
<rect x="80" y="324" width="190" height="42" rx="21" fill="${A}"/>
<rect x="420" y="150" width="100" height="140" rx="16" fill="${A}" opacity=".18"/>
<path d="M230 350l0 70 20-18 14 34 14-6-14-33 28-2z" fill="${F}" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>
<text x="300" y="470" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">VISITA → CONTATO → VENDA</text>`;

const dashboard = `
<rect x="40" y="40" width="520" height="360" rx="24" fill="${C}" stroke="${L}" stroke-width="3"/>
${[0,1].map(r=>[0,1].map(c=>`<g transform="translate(${70+c*250} ${70+r*165})"><rect width="220" height="145" rx="16" fill="none" stroke="${L}" stroke-width="3"/>
<rect x="20" y="20" width="34" height="34" rx="9" fill="${r===0&&c===0?A:F}" opacity="${r===0&&c===0?1:.8}"/>
<rect x="66" y="26" width="110" height="12" rx="6" fill="${F}" opacity=".8"/><rect x="66" y="46" width="70" height="10" rx="5" fill="${M}" opacity=".5"/>
${[0,1,2].map(i=>`<circle cx="30" cy="${84+i*20}" r="7" fill="${A}" opacity="${1-i*.25}"/><rect x="46" y="${79+i*20}" width="${130-i*28}" height="10" rx="5" fill="${M}" opacity=".4"/>`).join('')}</g>`).join('')).join('')}
<text x="300" y="460" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">TUDO EM UM SÓ LUGAR</text>`;

const steps = `
<path d="M50 420H550" stroke="${L}" stroke-width="3"/>
${[0,1,2,3].map(i=>`<rect x="${70+i*125}" y="${330-i*70}" width="105" height="${90+i*70}" rx="14" fill="${i===3?A:C}" stroke="${i===3?A:L}" stroke-width="3"/>
<text x="${122+i*125}" y="${390-i*70+ (i===3?0:0)}" text-anchor="middle" font-size="44" font-weight="500" fill="${i===3?'#fff':F}">0${i+1}</text>`).join('')}
<path d="M470 120l30-34 30 34M500 86v70" stroke="${A}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-60 -10)"/>`;

const pillars = `
${[['TRÁFEGO',0],['GESTÃO',1],['SITE',2]].map(([t,i])=>`<g transform="translate(${20+i*195} ${60+(i===1?-20:0)})">
<rect width="170" height="300" rx="22" fill="${i===1?A:C}" stroke="${i===1?A:L}" stroke-width="3"/>
<text x="85" y="56" text-anchor="middle" font-size="20" font-weight="600" letter-spacing="2" fill="${i===1?'#fff':F}">${t}</text>
${i===0?[60,100,80,140].map((h,k)=>`<rect x="${26+k*32}" y="${260-h}" width="22" height="${h}" rx="6" fill="${A}" opacity="${.4+k*.2}"/>`).join(''):''}
${i===1?[0,1,2,3].map(k=>`<circle cx="36" cy="${110+k*40}" r="10" fill="#fff"/><rect x="56" y="${104+k*40}" width="${90-k*12}" height="12" rx="6" fill="#fff" opacity=".6"/>`).join(''):''}
${i===2?`<rect x="22" y="96" width="126" height="150" rx="12" fill="none" stroke="${L}" stroke-width="3"/><rect x="38" y="120" width="90" height="14" rx="7" fill="${F}"/><rect x="38" y="146" width="64" height="10" rx="5" fill="${M}" opacity=".5"/><rect x="38" y="206" width="70" height="24" rx="12" fill="${A}"/>`:''}
</g>`).join('')}
<text x="300" y="440" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">UMA OPERAÇÃO SÓ</text>`;

const bars = `
<rect x="40" y="40" width="520" height="360" rx="24" fill="${C}" stroke="${L}" stroke-width="3"/>
${[90,150,120,210,190,280].map((h,i)=>`<rect x="${85+i*76}" y="${370-h}" width="52" height="${h}" rx="10" fill="${i===5?A:F}" opacity="${i===5?1:.22+i*.05}"/>`).join('')}
<path d="M90 250L200 210L290 230L400 150L510 90" stroke="${A}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 0"/>
<circle cx="510" cy="90" r="11" fill="${A}"/>
<text x="300" y="460" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">CPL · CONVERSÃO · ROAS</text>`;

const stopwatch = `
<rect x="265" y="30" width="70" height="26" rx="8" fill="${F}"/><rect x="290" y="52" width="20" height="26" fill="${F}"/>
<circle cx="300" cy="245" r="165" fill="${C}" stroke="${L}" stroke-width="4"/>
<circle cx="300" cy="245" r="165" fill="none" stroke="${A}" stroke-width="16" stroke-dasharray="520 1037" stroke-linecap="round" transform="rotate(-90 300 245)"/>
<path d="M300 245V135" stroke="${F}" stroke-width="10" stroke-linecap="round"/><path d="M300 245l62 38" stroke="${F}" stroke-width="10" stroke-linecap="round"/>
<circle cx="300" cy="245" r="14" fill="${A}"/>
${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<rect x="297" y="94" width="6" height="${i%3===0?20:10}" rx="3" fill="${M}" transform="rotate(${i*30} 300 245)"/>`).join('')}`;

const chat = `
<g><rect x="40" y="50" width="330" height="90" rx="26" fill="${C}" stroke="${L}" stroke-width="3"/>
<rect x="70" y="80" width="200" height="12" rx="6" fill="${F}" opacity=".7"/><rect x="70" y="104" width="130" height="12" rx="6" fill="${M}" opacity=".5"/></g>
<g><rect x="230" y="170" width="330" height="90" rx="26" fill="${A}"/>
<rect x="260" y="200" width="210" height="12" rx="6" fill="#fff" opacity=".9"/><rect x="260" y="224" width="120" height="12" rx="6" fill="#fff" opacity=".6"/></g>
<g><rect x="40" y="290" width="330" height="90" rx="26" fill="${C}" stroke="${L}" stroke-width="3" stroke-dasharray="10 10"/>
<circle cx="90" cy="335" r="9" fill="${M}"/><circle cx="125" cy="335" r="9" fill="${M}" opacity=".6"/><circle cx="160" cy="335" r="9" fill="${M}" opacity=".3"/></g>
<text x="300" y="450" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">QUEM RESPONDE, FECHA</text>`;

const checkcal = `
<rect x="70" y="60" width="460" height="360" rx="26" fill="${C}" stroke="${L}" stroke-width="3"/>
<path d="M70 150H530" stroke="${L}" stroke-width="3"/><rect x="70" y="60" width="460" height="90" rx="26" fill="${A}"/><rect x="70" y="120" width="460" height="30" fill="${A}"/>
<rect x="150" y="34" width="16" height="50" rx="8" fill="${F}"/><rect x="434" y="34" width="16" height="50" rx="8" fill="${F}"/>
${[0,1,2,3,4,5,6,7].map(i=>{const x=110+(i%4)*100,y=180+Math.floor(i/4)*110;return i===7?`<circle cx="${x+25}" cy="${y+25}" r="30" fill="${A}"/><path d="M${x+11} ${y+25}l10 11 19-22" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:`<circle cx="${x+25}" cy="${y+25}" r="26" fill="none" stroke="${L}" stroke-width="3"/><path d="M${x+13} ${y+25}l9 10 17-20" stroke="${A}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`}).join('')}`;

const connect = `
<path d="M150 150L300 330M450 150L300 330" stroke="${L}" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round"/>
${[['TRÁFEGO',150,150],['GESTÃO',450,150]].map(([t,x,y])=>`<circle cx="${x}" cy="${y}" r="78" fill="${C}" stroke="${L}" stroke-width="3"/><text x="${x}" y="${y+7}" text-anchor="middle" font-size="22" font-weight="500" letter-spacing="2" fill="${F}">${t}</text>`).join('')}
<circle cx="300" cy="330" r="92" fill="${A}"/><text x="300" y="338" text-anchor="middle" font-size="26" font-weight="500" letter-spacing="2" fill="#fff">SITE</text>
<text x="300" y="60" text-anchor="middle" font-size="26" fill="${M}" font-weight="500" letter-spacing="3">1 OPERAÇÃO, 3 FRENTES</text>`;

const magnifier = `
<rect x="60" y="90" width="300" height="300" rx="24" fill="${C}" stroke="${L}" stroke-width="3"/>
${[0,1,2,3,4].map(i=>`<rect x="90" y="${125+i*54}" width="${240-(i%3)*45}" height="16" rx="8" fill="${M}" opacity="${i===2?.9:.3}"/>`).join('')}
<circle cx="360" cy="230" r="120" fill="${A}" fill-opacity=".14" stroke="${A}" stroke-width="16"/>
<path d="M446 316L540 410" stroke="${A}" stroke-width="30" stroke-linecap="round"/>
<path d="M300 232l40 40 70-80" stroke="${F}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

const icon = `
<rect x="130" y="20" width="340" height="340" rx="70" fill="#171721" stroke="${L}" stroke-width="3"/>
<clipPath id="ic"><rect x="130" y="20" width="340" height="340" rx="70"/></clipPath><image href="elevion-icon-512.png" x="130" y="20" width="340" height="340" clip-path="url(#ic)"/>
<rect x="150" y="395" width="300" height="62" rx="31" fill="${A}"/>
<text x="300" y="434" text-anchor="middle" font-size="19" font-weight="600" letter-spacing="2.5" fill="#fff">CHAMAR NO WHATSAPP</text>`;

export const BRAND = 'ELEVION';
export const posts = [
  { n:1, date:'2026-10-12', dow:'Seg', theme:'dark', pilar:'Tráfego pago', formato:'Imagem única',
    eyebrow:'Tráfego pago', before:'Você paga por clique ou por', hl:'cliente?', after:'',
    body:'Clique barato não é resultado. Campanha boa se mede em lead qualificado e venda.', art:funnel,
    legenda:'Clique não paga boleto. Lead qualificado, sim.\n\nA gente configura Google Ads e Meta Ads pra trazer gente pronta pra comprar — e você acompanha CPL, conversão e ROAS toda semana.\n\nQuer saber o que sua campanha está entregando de verdade? Chama no WhatsApp pelo link da bio.',
    hashtags:'#trafegopago #googleads #metaads #marketingdigital #elevion' },
  { n:2, date:'2026-10-14', dow:'Qua', theme:'light', pilar:'Sites', formato:'Imagem única',
    eyebrow:'Sites para empresas', before:'Visita não é', hl:'venda.', after:'',
    body:'Um site só é bom se transforma quem chega em contato, orçamento ou pedido.', art:browser,
    legenda:'Site bonito que ninguém usa pra fechar negócio é só cartão de visita caro.\n\nA ELEVION faz sites pensados pra converter visita em cliente: caminho claro, chamada direta e contato a um toque.\n\nSeu site hoje leva o visitante até o WhatsApp? Se não, vale conversar.',
    hashtags:'#siteparaempresas #webdesign #conversao #elevion' },
  { n:3, date:'2026-10-16', dow:'Sex', theme:'dark', pilar:'Sistemas de gestão', formato:'Imagem única',
    eyebrow:'Sistemas de gestão', before:'Planilha não é', hl:'sistema.', after:'',
    body:'Venda, cliente e processo organizados em um só lugar, sem retrabalho.', art:dashboard,
    legenda:'Planilha quebra quando a operação cresce.\n\nCriamos sistemas de gestão sob medida pra sua empresa: tudo organizado em um só lugar, do lead à entrega.\n\nQuantas abas você abre pra fechar uma venda? Conta pra gente nos comentários.',
    hashtags:'#sistemadegestao #gestaoempresarial #automacao #elevion' },
  { n:4, date:'2026-10-19', dow:'Seg', theme:'light', pilar:'Autoridade', formato:'Imagem única',
    eyebrow:'ELEVION · Tráfego · Gestão · Sites', before:'Resultado não é sorte.', hl:'É entrega.', after:'',
    body:'Uma operação só: tráfego que traz lead, sistema que organiza, site que fecha.', art:pillars,
    legenda:'Resultado não é sorte. É entrega.\n\nA ELEVION junta tráfego, gestão e site numa operação só — sem você ter que coordenar três fornecedores.\n\nSalva esse post pra lembrar na hora de contratar.',
    hashtags:'#elevion #marketingdigital #trafegopago #sites #gestao' },
  { n:5, date:'2026-10-21', dow:'Qua', theme:'dark', pilar:'Tráfego pago', formato:'Imagem única',
    eyebrow:'Tráfego pago', before:'CPL baixo não paga', hl:'conta.', after:'',
    body:'O número que importa é quanto você vende por real investido, não só quanto custa o lead.', art:bars,
    legenda:'Lead barato que não compra só enche o CRM.\n\nPor isso olhamos CPL, conversão e ROAS juntos — e mostramos isso toda semana, não só num relatório mensal genérico.\n\nQual métrica você acompanha hoje?',
    hashtags:'#roas #cpl #trafegopago #performance #elevion' },
  { n:6, date:'2026-10-23', dow:'Sex', theme:'light', pilar:'Processo', formato:'Imagem única',
    eyebrow:'Como trabalhamos', before:'4 etapas.', hl:'Zero improviso.', after:'',
    body:'Diagnóstico, plano de ação, execução e resultado. Cada etapa com prazo e entrega clara.', art:steps,
    legenda:'Do diagnóstico ao resultado, o caminho é sempre o mesmo e você sabe em que etapa está:\n\n01 Diagnóstico\n02 Plano de ação\n03 Execução\n04 Resultado\n\nQuer começar pelo diagnóstico gratuito? Link na bio.',
    hashtags:'#processo #metodo #gestao #elevion' },
  { n:7, date:'2026-10-26', dow:'Seg', theme:'dark', pilar:'Sites', formato:'Imagem única',
    eyebrow:'Sites para empresas', before:'Seu site tem poucos', hl:'segundos', after:'pra convencer.',
    body:'Mensagem clara, carregamento rápido e um próximo passo óbvio: é isso que segura o visitante.', art:stopwatch,
    legenda:'O visitante decide rápido se fica ou sai.\n\nPor isso a primeira tela do seu site precisa dizer o que você faz, pra quem, e qual é o próximo passo.\n\nSe quiser uma opinião sincera sobre o seu site, é só chamar.',
    hashtags:'#site #ux #conversao #landingpage #elevion' },
  { n:8, date:'2026-10-28', dow:'Qua', theme:'light', pilar:'Gestão', formato:'Imagem única',
    eyebrow:'Gestão comercial', before:'Seu lead esfriou no', hl:'WhatsApp?', after:'',
    body:'Sem processo, o contato que chegou ontem vira o cliente do concorrente hoje.', art:chat,
    legenda:'Lead respondido rápido e acompanhado fecha mais.\n\nUm sistema simples de gestão organiza quem chegou, em que etapa está e quem precisa de retorno.\n\nSeu time sabe hoje quantos leads estão sem resposta?',
    hashtags:'#vendas #crm #atendimento #whatsappbusiness #elevion' },
  { n:9, date:'2026-10-30', dow:'Sex', theme:'dark', pilar:'Princípios', formato:'Imagem única',
    eyebrow:'Nossos princípios', before:'Prazo cumprido é o', hl:'mínimo.', after:'',
    body:'Entrega, responsabilidade e assertividade: o que prometemos é o que você recebe.', art:checkcal,
    legenda:'Três princípios guiam tudo o que fazemos: entrega, responsabilidade e assertividade.\n\nNa prática: prazo cumprido, processo claro e resultado mensurável.\n\nO que você mais valoriza num parceiro? Deixa aqui embaixo.',
    hashtags:'#valores #entrega #responsabilidade #elevion' },
  { n:10, date:'2026-11-02', dow:'Seg', theme:'light', pilar:'Autoridade', formato:'Imagem única',
    eyebrow:'Uma operação só', before:'Três fornecedores.', hl:'Zero conversa.', after:'',
    body:'Tráfego, sistema e site na mesma mesa, trabalhando pro mesmo número: o seu resultado.', art:connect,
    legenda:'Agência de tráfego, desenvolvedor de site e fornecedor de sistema raramente conversam entre si.\n\nNa ELEVION é uma operação só, com um responsável e uma meta.\n\nMarca alguém que ainda está coordenando três fornecedores.',
    hashtags:'#agencia #marketing #operacao #elevion' },
  { n:11, date:'2026-11-04', dow:'Qua', theme:'dark', pilar:'Diagnóstico', formato:'Imagem única',
    eyebrow:'Diagnóstico gratuito', before:'Quanto vale o lead que você', hl:'perdeu?', after:'',
    body:'Em uma conversa mostramos onde sua operação está vazando venda.', art:magnifier,
    legenda:'Todo negócio perde lead em algum ponto: no anúncio, no site ou no atendimento.\n\nO diagnóstico gratuito da ELEVION aponta onde está o vazamento e o que fazer primeiro.\n\nSem compromisso. Link na bio.',
    hashtags:'#diagnostico #vendas #marketing #elevion' },
  { n:12, date:'2026-11-06', dow:'Sex', theme:'light', pilar:'Conversão', formato:'Imagem única',
    eyebrow:'Fale com a ELEVION', before:'Descubra onde sua operação', hl:'vaza.', after:'',
    body:'Diagnóstico gratuito, resposta em poucas horas pelo WhatsApp. Sem compromisso.', art:icon,
    legenda:'Resultado não é sorte. É entrega.\n\nSolicite seu diagnóstico gratuito e receba resposta em poucas horas pelo WhatsApp.\n\nLink na bio.',
    hashtags:'#elevion #diagnosticogratuito #trafegopago #sites #gestao' },
];
