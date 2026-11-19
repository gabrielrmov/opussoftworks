// Regras de prospecção compartilhadas entre o popup (prévia) e o background (envio).

// Cada vertente tem seus próprios modelos de mensagem e a sua regra para escolher qual usar.
// `rotulos` dá o nome de cada modelo na engrenagem.

const normalizar = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Locadora de equipamento de obra (o público do Locarion): 'obra', 'talvez' (locadora genérica) ou 'fora'
// (carro, festa, imóvel…). Olha a categoria do Maps e o nome da empresa.
export function perfilLocarion(l) {
  const t = normalizar(`${l.categoria} ${l.nome}`);
  if (/constru|obra|andaim|betoneira|escora|martelete|compactador|ferramenta|munck|empilhadeira|plataforma elevat|guincho|terraplan|retroescav|bobcat|carregadeira/.test(t)) return 'obra';
  if (/carro|veiculo|automov|moto|caminha|onibus|festa|evento|buffet|brinquedo|fantasia|vestido|noiva|traje|roupa|cadeira|inflavel|livro|video|filme|dvd|jogo|bicicleta|barco|lancha|trailer|imovel|apartamento|temporada|audiovisual|camera|fotograf/.test(t)) return 'fora';
  return /equipamento|maquina|gerador|locadora|aluguel|locacao/.test(t) ? 'talvez' : 'fora';
}

const daOpus = (nome) => (nome ? `Meu nome é ${nome}, sou da Opus SoftWorks.` : 'Sou da Opus SoftWorks.');

export const CAMPANHAS = {
  opus: {
    nome: 'Sites e tráfego',
    apresentar: daOpus,
    rotulos: { semSite: 'Sem site', semTrafego: 'Sem tráfego pago', geral: 'Os demais' },
    mensagens: {
      semSite:
        '{saudacao}! É {empresa}?\n\n{apresentacao} Vi vocês no Google e reparei que ainda não têm site. Eu faço sites pra negócios como o de vocês, simples e que trazem cliente pelo Google e pelo WhatsApp.\n\nPosso te mandar um exemplo?',
      semTrafego:
        '{saudacao}! É {empresa}?\n\n{apresentacao} Trabalho com anúncios no Google e no Instagram pra negócios como o de vocês. Dei uma olhada e acho que dá pra trazer bastante cliente novo.\n\nPosso te explicar rapidinho como funciona?',
      geral:
        '{saudacao}! É {empresa}?\n\n{apresentacao} Trabalho com sites e anúncios pra negócios como o de vocês e tive uma ideia que pode trazer mais clientes.\n\nPosso te contar rapidinho?',
    },
    escolher: (l) => (semSiteLead(l) ? 'semSite' : l.analise === 'ok' && !temTrafego(l) ? 'semTrafego' : 'geral'),
  },
  locarion: {
    nome: 'Locarion',
    apresentar: daOpus,
    rotulos: { obra: 'Locadora de obra', duvida: 'Locadora a confirmar' },
    mensagens: {
      obra:
        '{saudacao}! É {empresa}?\n\n{apresentacao} A gente criou o Locarion, um sistema pra locadora de equipamentos: contratos, agenda de retirada e devolução, estoque e cobrança, tudo num lugar só e funcionando no celular.\n\nHoje vocês controlam isso como, planilha, papel ou algum sistema?',
      duvida:
        '{saudacao}! É {empresa}?\n\n{apresentacao} Vocês alugam equipamentos pra obra, tipo andaime, betoneira, escora? Pergunto porque criamos o Locarion, um sistema de gestão pra locadoras assim, e queria saber se faz sentido pra vocês.',
    },
    escolher: (l) => (perfilLocarion(l) === 'obra' ? 'obra' : 'duvida'),
  },
  videomaker: {
    nome: 'Videomaker',
    apresentar: (nome) => (nome ? `Meu nome é ${nome}, sou videomaker.` : 'Sou videomaker.'),
    rotulos: { comInstagram: 'Com Instagram', geral: 'Os demais' },
    mensagens: {
      comInstagram:
        '{saudacao}! É {empresa}?\n\n{apresentacao} Vi o Instagram de vocês, o {instagram}, e acho que dá pra mostrar o trabalho de um jeito bem mais forte com vídeo: reels, vídeo institucional, conteúdo pras redes.\n\nPosso te mandar umas ideias?',
      geral:
        '{saudacao}! É {empresa}?\n\n{apresentacao} Trabalho com vídeo pra negócios locais, como reels, vídeo institucional e conteúdo pras redes. Imaginei um formato que mostraria bem o que vocês fazem.\n\nPosso te explicar em 1 minuto?',
    },
    escolher: (l) => (l.analise === 'ok' && l.instagram ? 'comInstagram' : 'geral'),
  },
};
export const LIMITES_PADRAO = { intervaloMin: 60, intervaloMax: 150, porDia: 40 };

const temTrafego = (l) => l.anunciaGoogle || /Pixel Meta|Tag Google Ads|Pixel TikTok/.test(l.rastreio || '');
const semSiteLead = (l) => !l.temSite || ['só rede social', 'fora do ar'].includes(l.siteStatus);

const saudacao = (h = new Date().getHours()) => (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite');

// "Dra. Ana Lima - Dentista | Implantes em Curitiba" vira "Dra. Ana Lima".
const nomeCurto = (nome) => nome.split(/\s[-|–—~:]\s|\s\||,/)[0].trim();

// "da Fama Odonto", mas "do Restaurante Sabor da Terra" / "do Dr. João".
const MASCULINO = /^(restaurante|bar|bistro|salao|hotel|estudio|studio|espaco|centro|instituto|consultorio|escritorio|clube|mercado|supermercado|posto|grupo|laboratorio|colegio|hospital|cafe|armazem|atelie|emporio|banco|hostel|resort|buffet|pub|spa|gabinete|complexo|parque|sitio|acougue|hortifruti|deposito|dr|doutor|seu|sr)\b/;
const comArtigo = (nome) => `${MASCULINO.test(normalizar(nome)) ? 'do' : 'da'} ${nome}`;

const handleInsta = (url) => (url ? '@' + url.replace(/\/+$/, '').split('/').pop().replace(/^@/, '') : '');

// Textos editados pela pessoa. `mensagens` (formato antigo, sem vertente) valia só para Sites e tráfego.
export const textosPersonalizados = (wa = {}, campanha = 'opus') => ({
  ...(campanha === 'opus' ? wa.mensagens : {}),
  ...wa.textos?.[campanha],
});

// wa = configuração salva ({ textos, seuNome }). Usado na prévia e no envio.
export function montarMensagem(l, wa = {}, campanha = 'opus') {
  const c = CAMPANHAS[campanha] || CAMPANHAS.opus;
  const modelos = { ...c.mensagens, ...textosPersonalizados(wa, campanha) };
  const modelo = modelos[c.escolher(l)] || Object.values(modelos)[0];
  const seuNome = (wa.seuNome || '').trim();
  const vars = {
    saudacao: saudacao(),
    nome: nomeCurto(l.nome),
    empresa: comArtigo(nomeCurto(l.nome)),
    apresentacao: c.apresentar(seuNome),
    instagram: handleInsta(l.instagram),
    categoria: (l.categoria || '').toLowerCase(),
    nota: l.nota || '',
    avaliacoes: l.avaliacoes ? Number(l.avaliacoes).toLocaleString('pt-BR') : '',
  };
  return modelo
    .replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

export function numeroDoLead(l) {
  const bruto = (l.whatsapp && l.whatsapp.match(/wa\.me\/(\d+)/)?.[1]) || (l.telefone || '').split(',')[0];
  const d = String(bruto || '').replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) return '55' + d;
  return d.length >= 12 && d.length <= 15 ? d : '';
}
