import { CAMPANHAS, LIMITES_PADRAO, montarMensagem, numeroDoLead } from './prospeccao.js';
import { varrerGoogleMaps } from './extractors.js';

// Enriquecimento: abre o site de cada lead (fetch, sem aba) e descobre redes,
// contatos, pixels de tráfego e plataforma. Processa todo lead com analise === 'pendente'.

const store = chrome.storage.local;
const SIMULTANEOS = 4;
const TIMEOUT = 10000;

const REDE_SOCIAL = /^https?:\/\/(www\.)?(instagram\.com|facebook\.com|fb\.com|linktr\.ee|wa\.me|api\.whatsapp\.com|tiktok\.com|beacons\.ai)\//i;
const IG_RESERVADO = /^(p|reel|reels|explore|accounts|stories|tv|direct|developer|about|legal|share)$/i;
const FB_RESERVADO = /^(sharer|sharer\.php|share|dialog|tr|plugins|events|groups|login|policies|privacy|profile\.php)$/i;

let rodando = false;
let fila = Promise.resolve();

// Serializa as escritas para os workers não sobrescreverem uns aos outros.
function atualizar(id, dados) {
  fila = fila.then(async () => {
    const { leads = [] } = await store.get('leads');
    const i = leads.findIndex((l) => l.id === id);
    if (i === -1) return;
    leads[i] = { ...leads[i], ...dados };
    await store.set({ leads });
  });
  return fila;
}

async function baixar(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', credentials: 'omit' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return { html: (await r.text()).slice(0, 1_500_000), urlFinal: r.url };
  } finally {
    clearTimeout(t);
  }
}

const primeiro = (html, re, reservado) => {
  for (const m of html.matchAll(re)) if (!reservado || !reservado.test(m[1])) return m[1];
  return '';
};

export function analisarHtml(html, base) {
  const h = html.replace(/\\\//g, '/');
  const host = (() => {
    try {
      return new URL(base).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  const ig = primeiro(h, /instagram\.com\/([A-Za-z0-9_.]{2,30})/gi, IG_RESERVADO);
  const fb = primeiro(h, /facebook\.com\/(profile\.php\?id=\d+|[A-Za-z0-9_.-]{3,60})/gi, FB_RESERVADO);
  const tk = primeiro(h, /tiktok\.com\/@([A-Za-z0-9_.]{2,30})/gi);
  const li = primeiro(h, /linkedin\.com\/(company\/[A-Za-z0-9_-]+|in\/[A-Za-z0-9_-]+)/gi);
  const yt = primeiro(h, /youtube\.com\/(@[A-Za-z0-9_.-]+|channel\/[A-Za-z0-9_-]+|c\/[A-Za-z0-9_-]+)/gi);
  const wa = primeiro(h, /(?:wa\.me\/|whatsapp\.com\/send\/?\?phone=|phone=)(\+?\d{10,15})/gi);

  const emails = [
    ...new Set(
      (h.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/gi) || [])
        .map((e) => e.toLowerCase())
        .filter((e) => !/\.(png|jpe?g|gif|svg|webp|css|js)$/.test(e) && !/(sentry|wixpress|example|domain|email\.com$|exemplo)/.test(e)),
    ),
  ];
  // E-mail do próprio domínio primeiro.
  emails.sort((a, b) => b.endsWith(host) - a.endsWith(host));

  const telefones = [...new Set((h.match(/href=["']tel:([+\d\s().-]{8,})["']/gi) || []).map((t) => t.replace(/^href=["']tel:|["']$/gi, '').trim()))];

  const gtm = [...new Set(h.match(/GTM-[A-Z0-9]{4,9}/g) || [])];
  const contato = primeiro(h, /href=["']([^"'#]*(?:contato|contact|fale-conosco)[^"'#]*)["']/gi);

  const plataformas = [
    [/wp-content|wp-includes/i, 'WordPress'],
    [/wixstatic\.com|static\.parastorage|wix\.com/i, 'Wix'],
    [/cdn\.shopify\.com/i, 'Shopify'],
    [/nuvemshop|lojanuvem|tiendanube/i, 'Nuvemshop'],
    [/vtex(assets|commercestable)?\./i, 'VTEX'],
    [/webflow\.(com|io)/i, 'Webflow'],
    [/squarespace\.com/i, 'Squarespace'],
    [/lojaintegrada/i, 'Loja Integrada'],
    [/tray\.com\.br|traycdn/i, 'Tray'],
    [/_next\/static/i, 'Next.js'],
  ];

  return {
    instagram: ig ? `https://instagram.com/${ig}` : '',
    facebook: fb ? `https://facebook.com/${fb}` : '',
    tiktok: tk ? `https://tiktok.com/@${tk}` : '',
    linkedin: li ? `https://linkedin.com/${li}` : '',
    youtube: yt ? `https://youtube.com/${yt}` : '',
    whatsapp: wa ? `https://wa.me/${wa.replace('+', '')}` : '',
    email: emails.slice(0, 3).join(', '),
    telefoneSite: telefones.slice(0, 2).join(', '),
    pixelMeta: /fbq\(\s*['"]init['"]|connect\.facebook\.net\/[^"']*fbevents\.js/i.test(h),
    googleAds: /\bAW-\d{6,}|googleadservices\.com\/pagead\/conversion/i.test(h),
    analytics: /gtag\/js\?id=(G|UA)-|gtag\(\s*['"]config['"]\s*,\s*['"](G|UA)-|google-analytics\.com\/(analytics|ga)\.js/i.test(h),
    tiktokPixel: /analytics\.tiktok\.com|ttq\.load\(/i.test(h),
    gtm,
    plataforma: plataformas.filter(([re]) => re.test(h)).map(([, nome]) => nome).slice(0, 2).join(' + '),
    contato: contato && !/^(mailto|tel|javascript):/i.test(contato) ? new URL(contato, base).href : '',
  };
}

// O GTM costuma carregar Pixel/Ads por dentro do container; olha lá também.
async function analisarGtm(ids) {
  const r = { pixelMeta: false, googleAds: false, analytics: false, tiktokPixel: false };
  for (const id of ids.slice(0, 2)) {
    try {
      const { html: js } = await baixar(`https://www.googletagmanager.com/gtm.js?id=${id}`);
      r.pixelMeta ||= /fbevents\.js|fbq\(/.test(js);
      // Só IDs reais: nomes de template (__awct, googleadservices) aparecem no runtime de qualquer container.
      r.googleAds ||= /AW-\d{6,}/.test(js);
      r.analytics ||= /\bG-[A-Z0-9]{6,12}\b|\bUA-\d{4,}-\d+/.test(js);
      r.tiktokPixel ||= /analytics\.tiktok\.com|ttq\./.test(js);
    } catch {}
  }
  return r;
}

async function enriquecer(lead) {
  // "Site" que na verdade é rede social: não é site, mas já vale como contato.
  if (REDE_SOCIAL.test(lead.site)) {
    const s = lead.site;
    const campo = /instagram/.test(s) ? 'instagram' : /facebook|fb\.com/.test(s) ? 'facebook' : /wa\.me|whatsapp/.test(s) ? 'whatsapp' : /tiktok/.test(s) ? 'tiktok' : 'linkBio';
    return { site: '', [campo]: s, analise: 'ok', siteStatus: 'só rede social' };
  }

  let pagina;
  try {
    pagina = await baixar(lead.site);
  } catch (e) {
    return { analise: 'ok', siteStatus: 'fora do ar' };
  }

  const d = analisarHtml(pagina.html, pagina.urlFinal);
  if ((!d.email || !d.instagram) && d.contato) {
    try {
      const c = analisarHtml((await baixar(d.contato)).html, d.contato);
      for (const k of ['instagram', 'facebook', 'tiktok', 'linkedin', 'whatsapp', 'email', 'telefoneSite']) d[k] ||= c[k];
    } catch {}
  }
  if (d.gtm.length) {
    const g = await analisarGtm(d.gtm);
    for (const k of Object.keys(g)) d[k] ||= g[k];
  }

  const sinais = [
    d.pixelMeta && 'Pixel Meta',
    d.googleAds && 'Tag Google Ads',
    d.tiktokPixel && 'Pixel TikTok',
    d.analytics && 'Analytics',
    d.gtm.length && 'GTM',
  ].filter(Boolean);

  const resultado = { analise: 'ok', siteStatus: 'no ar', plataforma: d.plataforma, rastreio: sinais.join(', ') };
  // Não sobrescreve o que já veio do Maps/página.
  for (const k of ['instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'whatsapp', 'email']) {
    if (!lead[k] && d[k]) resultado[k] = d[k];
  }
  if (!lead.telefone && d.telefoneSite) resultado.telefone = d.telefoneSite;
  return resultado;
}

async function processarPendentes() {
  if (rodando) return;
  rodando = true;
  try {
    while (true) {
      const { leads = [] } = await store.get('leads');
      const lote = leads.filter((l) => l.analise === 'pendente').slice(0, SIMULTANEOS);
      if (!lote.length) break;
      await Promise.all(
        lote.map(async (l) => {
          let dados;
          try {
            dados = l.site ? await enriquecer(l) : { analise: 'ok' };
          } catch {
            dados = { analise: 'ok' };
          }
          await atualizar(l.id, dados);
        }),
      );
    }
  } finally {
    rodando = false;
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.tipo === 'enriquecer') processarPendentes();
});

chrome.runtime.onStartup.addListener(async () => {
  const { busca } = await store.get('busca');
  if (busca?.ativo) await store.set({ busca: { ...busca, ativo: false, erro: 'A pesquisa foi interrompida porque o Chrome foi fechado.' } });
  processarPendentes();
});


// ---------- Prospecção automática pelo WhatsApp (WA-AKG) ----------
// Fila em chrome.storage ('envio'); cada envio agenda o próximo com chrome.alarms
// (o service worker pode dormir entre um e outro). Configuração em 'wa'.

class ErroFatal extends Error {}

async function chamarGateway(wa, caminho, corpo) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(`${wa.url}${caminho}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': wa.chave },
      body: JSON.stringify(corpo),
      signal: ctrl.signal,
    });
    if (r.status === 401 || r.status === 403) throw new ErroFatal('Chave de API recusada pelo WA-AKG.');
    if (r.status === 404 || r.status === 503) throw new ErroFatal('Sessão do WhatsApp desconectada ou não encontrada.');
    return r;
  } catch (e) {
    if (e instanceof ErroFatal) throw e;
    throw new ErroFatal('Não foi possível falar com o servidor WA-AKG.');
  } finally {
    clearTimeout(t);
  }
}

// Números do Brasil podem existir com ou sem o 9 extra; pergunta ao WA-AKG qual JID é o real.
async function resolverJid(wa, numero) {
  const candidatos = [numero];
  const m = numero.match(/^55(\d{2})(9?)(\d{8})$/);
  if (m) candidatos.push(m[2] ? `55${m[1]}${m[3]}` : `55${m[1]}9${m[3]}`);
  const r = await chamarGateway(wa, `/api/chat/${encodeURIComponent(wa.sessao)}/check`, { numbers: candidatos });
  if (!r.ok) return `${numero}@s.whatsapp.net`;
  const json = await r.json().catch(() => ({}));
  const resultados = json?.data?.results || json?.results || [];
  for (const c of candidatos) {
    const achou = resultados.find((x) => x.number === c && x.exists && x.jid);
    if (achou) return achou.jid;
  }
  return resultados.length ? null : `${numero}@s.whatsapp.net`;
}

// O WA-AKG separa o nome da sessão (ex: "Opus") do sessionId usado na API.
async function listarSessoes(wa) {
  let r;
  try {
    r = await fetch(`${wa.url}/api/sessions`, { headers: { 'X-API-Key': wa.chave }, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error('Não foi possível falar com o servidor WA-AKG. Confira o endereço.');
  }
  if (r.status === 401 || r.status === 403) throw new Error('Chave de API recusada pelo WA-AKG.');
  if (!r.ok) throw new Error(`O WA-AKG respondeu ${r.status}.`);
  const json = await r.json().catch(() => ({}));
  return (json.data || []).map((s) => ({ nome: s.name || s.sessionId, id: s.sessionId, status: s.status }));
}

async function testarConexao(wa) {
  const existentes = await listarSessoes(wa);
  // A sessão padrão e as escolhidas por vertente precisam existir e estar conectadas.
  const usos = [['padrão', wa.sessao], ...Object.entries(wa.sessoes || {}).map(([c, id]) => [CAMPANHAS[c]?.nome || c, id])];
  for (const [uso, id] of usos) {
    const s = existentes.find((x) => x.id === id);
    if (!s) throw new Error(`A sessão de "${uso}" não existe nesse servidor. Escolha uma da lista.`);
    if (s.status !== 'CONNECTED') throw new Error(`O número "${s.nome}" (${uso}) está desconectado. Abra o painel do WA-AKG e leia o QR code.`);
  }
  const r = await chamarGateway(wa, `/api/chat/${encodeURIComponent(wa.sessao)}/check`, { numbers: ['5511999999999'] });
  if (!r.ok) throw new Error(`O WA-AKG respondeu ${r.status}.`);
  return true;
}

// Cada vertente pode enviar por um número (sessão) próprio; sem escolha, usa a sessão padrão.
const sessaoDe = (wa, campanha) => wa.sessoes?.[campanha] || wa.sessao;

async function enviarParaLead(wa, l, campanha) {
  const sessao = sessaoDe(wa, campanha);
  const conta = { ...wa, sessao };
  const numero = numeroDoLead(l);
  if (!numero) return { prospeccao: 'sem whatsapp' };
  const jid = await resolverJid(conta, numero);
  if (!jid) return { prospeccao: 'sem whatsapp' };
  const texto = montarMensagem(l, wa, campanha);
  const r = await chamarGateway(conta, `/api/messages/${encodeURIComponent(sessao)}/${encodeURIComponent(jid)}/send`, {
    message: { text: texto },
  });
  if (!r.ok) return { prospeccao: 'erro', erroEnvio: `WA-AKG respondeu ${r.status}` };
  return { prospeccao: 'enviado', campanha, sessao, enviadoEm: new Date().toISOString(), mensagemEnviada: texto };
}

const hoje = () => new Date().toLocaleDateString('sv-SE');
let enviando = false;

async function proximoEnvio() {
  if (enviando) return;
  enviando = true;
  try {
    const { envio, wa, leads = [] } = await store.get(['envio', 'wa', 'leads']);
    if (!envio?.ativo) return;
    const limites = { ...LIMITES_PADRAO, ...wa?.limites };
    // Contagem do dia por número (sessão): cada número tem o próprio limite.
    const contagem = envio.contagem?.dia === hoje() ? { ...envio.contagem } : { dia: hoje() };
    const sessaoDoId = (id) => sessaoDe(wa, envio.campanhas?.[id] || 'opus');
    const noLimite = (id) => (contagem[sessaoDoId(id)] || 0) >= limites.porDia;

    if (!envio.fila.length) {
      await store.set({ envio: { ...envio, ativo: false, fim: true, proximoEm: null } });
      return;
    }
    // Pega o primeiro da fila cujo número ainda não bateu o limite; se todos bateram, espera amanhã.
    const posicao = envio.fila.findIndex((id) => !noLimite(id));
    if (posicao === -1) {
      // Retoma sozinho amanhã às 9h.
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      amanha.setHours(9, 0, 0, 0);
      chrome.alarms.create('envio', { when: amanha.getTime() });
      await store.set({ envio: { ...envio, contagem, proximoEm: amanha.getTime(), pausa: 'limite' } });
      return;
    }

    const id = envio.fila[posicao];
    const resto = envio.fila.filter((_, i) => i !== posicao);
    const lead = leads.find((l) => l.id === id);
    let resultado = null;
    if (lead && lead.prospeccao !== 'enviado') {
      try {
        resultado = await enviarParaLead(wa, lead, envio.campanhas?.[id] || 'opus');
      } catch (e) {
        // Erro do servidor (chave, sessão, rede): para tudo e libera os leads para nova tentativa.
        await chrome.alarms.clear('envio');
        await store.set({ envio: { ...envio, ativo: false, fila: [], erro: e.message, proximoEm: null } });
        await liberarFila();
        return;
      }
      await atualizar(id, resultado);
    }

    const enviou = resultado?.prospeccao === 'enviado';
    const atraso = enviou ? (limites.intervaloMin + Math.random() * (limites.intervaloMax - limites.intervaloMin)) * 1000 : 2000;
    const proximoEm = resto.length ? Date.now() + atraso : null;
    const { envio: atual } = await store.get('envio');
    if (!atual?.ativo) return; // parado durante o envio
    await store.set({
      envio: {
        ...atual,
        fila: resto,
        feitos: (atual.feitos || 0) + 1,
        contagem: enviou ? { ...contagem, [sessaoDoId(id)]: (contagem[sessaoDoId(id)] || 0) + 1 } : contagem,
        proximoEm,
        pausa: null,
        ativo: resto.length > 0,
        fim: resto.length === 0,
      },
    });
    if (proximoEm) chrome.alarms.create('envio', { when: proximoEm });
  } finally {
    enviando = false;
  }
}

async function iniciarEnvio(ids, campanha = 'opus') {
  const { leads = [], envio } = await store.get(['leads', 'envio']);
  const novos = ids.filter((id) => leads.some((l) => l.id === id && l.prospeccao !== 'enviado'));
  const fila = [...new Set([...(envio?.ativo ? envio.fila : []), ...novos])];
  for (const id of novos) await atualizar(id, { prospeccao: 'na fila' });
  // Cada lead guarda a vertente escolhida no momento do envio (a fila pode misturar as duas).
  const campanhas = { ...(envio?.ativo ? envio.campanhas : {}), ...Object.fromEntries(novos.map((id) => [id, campanha])) };
  await store.set({
    envio: { ...envio, campanhas, ativo: fila.length > 0, fila, total: fila.length + (envio?.ativo ? envio.feitos || 0 : 0), feitos: envio?.ativo ? envio.feitos || 0 : 0, erro: null, fim: false },
  });
  if (!envio?.ativo || !envio.proximoEm) proximoEnvio();
}

async function liberarFila() {
  const { leads = [] } = await store.get('leads');
  for (const l of leads) if (l.prospeccao === 'na fila') await atualizar(l.id, { prospeccao: null });
}

async function pararEnvio() {
  await chrome.alarms.clear('envio');
  const { envio } = await store.get('envio');
  await store.set({ envio: { ...envio, ativo: false, fila: [], proximoEm: null, pausa: null } });
  await liberarFila();
}

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === 'envio') proximoEnvio();
});

chrome.runtime.onMessage.addListener((msg, _remetente, responder) => {
  if (msg?.tipo === 'iniciarEnvio') iniciarEnvio(msg.ids, msg.campanha);
  if (msg?.tipo === 'pararEnvio') pararEnvio();
  if (msg?.tipo === 'listarSessoes') {
    listarSessoes(msg.wa).then(
      (sessoes) => responder({ ok: true, sessoes }),
      (e) => responder({ ok: false, erro: e.message }),
    );
    return true;
  }
  if (msg?.tipo === 'testarWa') {
    testarConexao(msg.wa).then(
      () => responder({ ok: true }),
      (e) => responder({ ok: false, erro: e.message }),
    );
    return true;
  }
});

// Clicar no ícone abre o painel lateral: fica preso ao navegador e continua aberto ao trocar de aba.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

// ---------- Pesquisa automática no Google Maps ----------
// Abre uma aba do Maps, pesquisa "nicho em cidade" para cada nicho e junta os leads (a varredura em si
// é a mesma do botão "Buscar leads"). Estado em chrome.storage ('busca'): o painel só mostra o andamento.

let pesquisando = false;
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

function abrirNaAba(tabId, url) {
  return new Promise((resolve) => {
    let comecou = false;
    const fim = () => {
      chrome.tabs.onUpdated.removeListener(ouvir);
      clearTimeout(limite);
      resolve();
    };
    // Só vale o "complete" depois do "loading" da nova página (evita pegar o da página anterior).
    const ouvir = (id, mud) => {
      if (id !== tabId) return;
      if (mud.status === 'loading') comecou = true;
      if (mud.status === 'complete' && comecou) fim();
    };
    const limite = setTimeout(fim, 30000);
    chrome.tabs.onUpdated.addListener(ouvir);
    chrome.tabs.update(tabId, { url });
  });
}

async function pesquisarNichos({ cidade, nichos, maximo = 40 }) {
  if (pesquisando) return;
  pesquisando = true;
  const antes = ((await store.get('leads')).leads || []).length;
  await store.set({ busca: { ativo: true, cidade, nichos, indice: 0, atual: nichos[0], maximo }, scan: null });
  // O service worker dorme após ~30 s parado; este "pulso" o mantém acordado durante a pesquisa.
  const pulso = setInterval(() => store.get('busca'), 20000);
  let aba = null;
  let erro = '';
  try {
    // Aba em primeiro plano: o Maps só carrega mais resultados ao rolar uma aba visível.
    aba = await chrome.tabs.create({ url: 'about:blank', active: true });
    for (let i = 0; i < nichos.length; i++) {
      const { busca } = await store.get('busca');
      if (busca?.cancelar) break;
      await store.set({ busca: { ...busca, indice: i, atual: nichos[i] } });
      await abrirNaAba(aba.id, `https://www.google.com/maps/search/${encodeURIComponent(`${nichos[i]} em ${cidade}`)}?hl=pt-BR`);
      await chrome.scripting.executeScript({ target: { tabId: aba.id }, func: varrerGoogleMaps, args: [maximo] });
      // Pausa entre nichos (não parece rajada), mas dá para parar a qualquer momento.
      for (let ms = 3000 + Math.random() * 4000; ms > 0 && i < nichos.length - 1; ms -= 500) {
        await pausa(500);
        if ((await store.get('busca')).busca?.cancelar) break;
      }
    }
  } catch (e) {
    erro = `A pesquisa parou: ${e.message}`;
  } finally {
    clearInterval(pulso);
    if (aba) chrome.tabs.remove(aba.id).catch(() => {});
    const { busca } = await store.get('busca');
    const depois = ((await store.get('leads')).leads || []).length;
    // O "scan" do último nicho fica como estava; limpa para não mostrar erro/andamento antigo.
    await store.set({ scan: null, busca: { ...busca, ativo: false, fim: true, erro, novos: Math.max(0, depois - antes) } });
    pesquisando = false;
    processarPendentes(); // (uma mensagem enviada pelo próprio background não chegaria ao ouvinte dele)
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.tipo === 'pesquisar' && Array.isArray(msg.nichos) && msg.nichos.length && msg.cidade) pesquisarNichos(msg);
  if (msg?.tipo === 'pararPesquisa') store.get('busca').then(({ busca }) => busca && store.set({ busca: { ...busca, cancelar: true } }));
});
