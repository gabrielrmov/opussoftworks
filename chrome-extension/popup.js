import { varrerGoogleMaps, capturarPagina } from './extractors.js';
import {
  CAMPANHAS,
  LIMITES_PADRAO,
  PONTUACAO_MINIMA,
  montarMensagem,
  numeroDoLead,
  perfilLocarion,
  qualificadoPara,
  qualificar,
  textosPersonalizados,
} from './prospeccao.js';

const $ = (id) => document.getElementById(id);
const store = chrome.storage.local;
const MAX_MAPS = 100;

let leads = [];
let aba = null;
let filtro = '';
let ultimoScan = null;
let loteAnalise = 0;
let envio = null;
let wa = null;
let busca = null;
let soQualificadosFiltro = false;
let pesquisa = { cidade: '', escolhidos: ['restaurante', 'clínica de estética', 'academia', 'pousada'], extras: [] };
const selecionados = new Set();

const ICONES = {
  busca: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  captura: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  baixar: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>',
  lixo: '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  whats: '<svg viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  insta: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4z"/><path d="M17.5 6.5h0"/></svg>',
  site: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  email: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  face: '<svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  mapa: '<svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  lupa: '<svg viewBox="0 0 24 24"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6"/></svg>',
  config: '<svg viewBox="0 0 24 24"><path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  fechar: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  enviar: '<svg viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
};

// ---------- Regras do lead ----------

const SINAIS_TRAFEGO = [
  ['Pixel Meta', 'Meta'],
  ['Tag Google Ads', 'Google'],
  ['Pixel TikTok', 'TikTok'],
];

const trafego = (l) => {
  const s = SINAIS_TRAFEGO.filter(([sinal]) => (l.rastreio || '').includes(sinal)).map(([, nome]) => nome);
  if (l.anunciaGoogle && !s.includes('Google')) s.unshift('Google');
  return s;
};
const semSite = (l) => !l.temSite || l.siteStatus === 'só rede social' || l.siteStatus === 'fora do ar';
const semTrafego = (l) => l.analise === 'ok' && !trafego(l).length;

// Monta o link do WhatsApp a partir do telefone (assume Brasil se vier sem DDI).
function linkWhats(l) {
  if (l.whatsapp) return l.whatsapp;
  const digitos = (l.telefone || '').split(',')[0].replace(/\D/g, '');
  if (digitos.length < 10) return '';
  return `https://wa.me/${digitos.length <= 11 ? '55' + digitos : digitos}`;
}

function situacaoSite(l) {
  if (l.siteStatus === 'só rede social') return 'Só rede social';
  if (!l.temSite) return 'Sem site';
  if (l.anunciaGoogle && !l.site) return 'Tem (via anúncio)';
  return l.siteStatus === 'fora do ar' ? 'Fora do ar' : 'No ar';
}

const bibliotecaMeta = (l) =>
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&search_type=keyword_unordered&q=${encodeURIComponent(l.nome)}`;

const COLUNAS = [
  ['Nome', (l) => l.nome],
  ['Categoria', (l) => l.categoria],
  ['Telefone', (l) => l.telefone],
  ['WhatsApp', linkWhats],
  ['E-mail', (l) => l.email],
  ['Instagram', (l) => l.instagram],
  ['Facebook', (l) => l.facebook],
  ['TikTok', (l) => l.tiktok],
  ['LinkedIn', (l) => l.linkedin],
  ['YouTube', (l) => l.youtube],
  ['Site', (l) => l.site],
  ['Situação do site', situacaoSite],
  ['Plataforma do site', (l) => l.plataforma],
  ['Anuncia em', (l) => trafego(l).join(', ') || (l.analise === 'ok' ? 'Nenhum sinal' : '')],
  ['Rastreamento no site', (l) => l.rastreio],
  ['Endereço', (l) => l.endereco],
  ['Nota', (l) => l.nota],
  ['Avaliações', (l) => l.avaliacoes],
  ['Fonte', (l) => l.fonte],
  ['URL', (l) => l.url],
  ['Biblioteca de anúncios Meta', bibliotecaMeta],
  ['Perfil locadora', (l) => ({ obra: 'Locadora de obra', talvez: 'A confirmar' })[perfilLocarion(l)] || ''],
  ['Vertente', (l) => CAMPANHAS[l.campanha]?.nome || ''],
  ['Prospecção', (l) => l.prospeccao || ''],
  ['Enviado em', (l) => l.enviadoEm || ''],
  ['Capturado em', (l) => l.capturadoEm],
];

// ---------- DOM ----------

function el(tag, props = {}, ...filhos) {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...filhos.filter(Boolean));
  return n;
}

const comIcone = (n, icone, texto) => {
  n.innerHTML = ICONES[icone];
  if (texto) n.append(texto);
  return n;
};

const contato = (href, icone, titulo, className = '') =>
  comIcone(el('a', { href, target: '_blank', title: titulo, className }), icone, el('span', { textContent: rotulo(titulo) }));

// Rótulo curto no botão; o completo fica no title.
const rotulo = (titulo) => titulo.split(' · ')[0];

const tag = (texto, tipo = '') => el('span', { className: `tag ${tipo}`, textContent: texto });

const handle = (url) => '@' + url.replace(/\/+$/, '').split('/').pop().replace(/^@/, '');

const iniciais = (nome) =>
  nome
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^\p{Lu}/u.test(p))
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '•';

const minimoQualificado = () => Number(wa?.pontuacaoMinima ?? PONTUACAO_MINIMA);
const soQualificadosAtivo = () => wa?.soQualificados !== false;
const COR_VERTENTE = { opus: 'sites', locarion: 'locarion', videomaker: 'videomaker' };
const NOME_CURTO = { opus: 'Sites', locarion: 'Locarion', videomaker: 'Videomaker' };

const ROTULO_PROSPECCAO = { enviado: '✓ mensagem enviada', 'na fila': 'na fila do WhatsApp', 'sem whatsapp': 'sem WhatsApp', erro: 'erro no envio' };

// O avatar mostra a seleção (✓); clicar em qualquer parte do card seleciona.
function botaoSelecao(l) {
  const marcado = selecionados.has(l.id);
  const b = el('button', {
    className: 'avatar',
    title: marcado ? 'Desmarcar' : 'Selecionar para prospectar',
    ariaPressed: String(marcado),
  });
  if (marcado) comIcone(b, 'check');
  else b.textContent = iniciais(l.nome);
  return b;
}

function alternarSelecao(id) {
  if (selecionados.has(id)) selecionados.delete(id);
  else selecionados.add(id);
  render();
}

function itemLead(l) {
  const detalhe = [l.telefone?.split(',')[0], l.endereco].filter(Boolean).join(' · ');
  const sinais = trafego(l);
  const situacao = situacaoSite(l);
  const whats = linkWhats(l);
  const perfil = perfilLocarion(l);
  const quente = semSite(l) || semTrafego(l) || perfil === 'obra';

  const tags = el(
    'div',
    { className: 'tags' },
    l.analise === 'pendente' && tag('analisando…', 'neutra'),
    semSite(l) && tag(situacao.toLowerCase(), 'quente'),
    sinais.length ? tag(`anuncia · ${sinais.join(' + ')}`) : semTrafego(l) && tag('sem tráfego', 'quente'),
    ...qualificadoPara(l, minimoQualificado()).map((c) => {
      const q = qualificar(l, c, minimoQualificado());
      return Object.assign(tag(`★ ${NOME_CURTO[c]}`, `qual ${COR_VERTENTE[c]}`), { title: `${CAMPANHAS[c].nome}: ${q.pontos} pontos\n${q.motivos.join(' · ')}` });
    }),
    perfil === 'obra' && tag('locadora de obra', 'quente'),
    perfil === 'talvez' && tag('locadora a confirmar', 'neutra'),
    l.prospeccao && tag(`${ROTULO_PROSPECCAO[l.prospeccao] || l.prospeccao}${l.prospeccao === 'enviado' && l.campanha ? ` · ${CAMPANHAS[l.campanha]?.nome}` : ''}`, `prospeccao ${l.prospeccao.replace(/\s/g, '-')}`),
  );

  const remover = el('button', { className: 'remover', title: 'Remover lead', ariaLabel: 'Remover lead' });
  comIcone(remover, 'lixo');
  remover.addEventListener('click', () => store.set({ leads: leads.filter((x) => x.id !== l.id) }));

  const contatos = el(
    'div',
    { className: 'contatos' },
    whats && contato(whats, 'whats', 'WhatsApp', 'whats'),
    l.instagram && contato(l.instagram, 'insta', handle(l.instagram), 'insta'),
    l.facebook && contato(l.facebook, 'face', 'Facebook'),
    l.email && contato(`mailto:${l.email.split(',')[0].trim()}`, 'email', `E-mail · ${l.email}`),
    l.site && contato(l.site, 'site', l.plataforma ? `Site · ${l.plataforma}` : 'Site'),
    l.fonte === 'Google Maps' && contato(l.url, 'mapa', 'Maps'),
    remover,
  );

  const li = el(
    'li',
    { className: `lead${quente ? ' quente' : ''}${selecionados.has(l.id) ? ' selecionado' : ''}` },
    el(
      'div',
      { className: 'lead-topo' },
      botaoSelecao(l),
      el(
        'div',
        { className: 'lead-info' },
        el('div', { className: 'lead-nome', textContent: l.nome, title: l.nome }),
        l.categoria && el('div', { className: 'lead-meta', textContent: l.categoria }),
      ),
      l.nota &&
        el(
          'div',
          { className: 'nota', title: `${l.nota} estrelas${l.avaliacoes ? `, ${l.avaliacoes} avaliações` : ''}` },
          el('strong', { textContent: `★ ${l.nota}` }),
          l.avaliacoes && el('span', { textContent: Number(l.avaliacoes).toLocaleString('pt-BR') }),
        ),
    ),
    detalhe && el('div', { className: 'lead-detalhe', textContent: detalhe, title: detalhe }),
    tags.childElementCount ? tags : null,
    contatos,
  );
  // Links de contato e a lixeira fazem a ação deles; o resto do card seleciona.
  li.addEventListener('click', (e) => {
    if (!e.target.closest('a, .remover')) alternarSelecao(l.id);
  });
  return li;
}

const locadora = (l) => perfilLocarion(l) !== 'fora';
const visiveis = () =>
  leads
    .filter((l) => (filtro === 'sem-site' ? semSite(l) : filtro === 'sem-trafego' ? semTrafego(l) : filtro === 'locadora' ? locadora(l) : true))
    .filter((l) => !soQualificadosFiltro || qualificadoPara(l, minimoQualificado()).length);

function render() {
  $('n-todos').textContent = leads.length;
  $('n-sem-site').textContent = leads.filter(semSite).length;
  $('n-sem-trafego').textContent = leads.filter(semTrafego).length;
  $('n-locadora').textContent = leads.filter(locadora).length;
  document.querySelectorAll('.bloco').forEach((b) => b.classList.toggle('ativo', b.dataset.filtro === filtro));

  const lista = visiveis();
  $('vazio').hidden = leads.length > 0;
  $('lista').hidden = !lista.length;
  $('lista').replaceChildren(...lista.map(itemLead));
  $('btn-csv').disabled = !lista.length;
  $('btn-csv').lastChild.textContent = filtro && lista.length ? ` Exportar ${lista.length} para planilha` : ' Exportar planilha';
  $('btn-limpar').disabled = !leads.length;
  $('btn-qualificados').setAttribute('aria-pressed', String(soQualificadosFiltro));
  renderSelecao(lista);
  renderProgresso();
  renderEnvio();
  renderPesquisa();
}

// ---------- Seleção e prospecção ----------

const prospectavel = (l) => l.prospeccao !== 'enviado' && l.prospeccao !== 'na fila' && numeroDoLead(l);

function renderSelecao(lista) {
  for (const id of selecionados) if (!leads.some((l) => l.id === id)) selecionados.delete(id);
  const candidatos = lista.filter(prospectavel);
  const todos = candidatos.length > 0 && candidatos.every((l) => selecionados.has(l.id));
  $('selecao').hidden = !leads.length;
  $('btn-selecionar').textContent = todos ? 'Desmarcar todos' : `Selecionar todos com WhatsApp (${candidatos.length})`;
  $('btn-selecionar').disabled = !candidatos.length;
  $('selecao-texto').textContent = selecionados.size
    ? `${selecionados.size} selecionado${selecionados.size > 1 ? 's' : ''}`
    : 'Clique nos leads para selecionar';
  $('selecao-texto').classList.toggle('dica-sel', !selecionados.size);

  const n = selecionados.size;
  $('envio-escolha').hidden = !n;
  $('btn-csv').hidden = Boolean(n);
  $('escolha-titulo').textContent = `Prospectar ${n} lead${n > 1 ? 's' : ''} pelo WhatsApp · escolha a vertente`;
}

$('btn-qualificados').addEventListener('click', () => {
  soQualificadosFiltro = !soQualificadosFiltro;
  render();
});

$('btn-selecionar').addEventListener('click', () => {
  const candidatos = visiveis().filter(prospectavel);
  const todos = candidatos.every((l) => selecionados.has(l.id));
  for (const l of candidatos) todos ? selecionados.delete(l.id) : selecionados.add(l.id);
  render();
});

// Cada botão envia com a vertente dele: muda só o modelo de mensagem.
function prospectar(campanha) {
  if (!wa?.url || !wa?.sessao || !wa?.chave) {
    abrirConfig();
    $('teste-resultado').textContent = 'Conecte o WA-AKG para enviar.';
    return;
  }
  const selecionadosOk = [...selecionados].map((id) => leads.find((l) => l.id === id)).filter((l) => l && prospectavel(l));
  const minimo = minimoQualificado();
  // Por padrão só segue quem passa da pontuação mínima da vertente escolhida.
  const alvos = soQualificadosAtivo() ? selecionadosOk.filter((l) => qualificar(l, campanha, minimo).qualificado) : selecionadosOk;
  const deFora = selecionadosOk.length - alvos.length;
  if (!alvos.length) {
    aviso(
      `${selecionadosOk.length === 1 ? 'O lead selecionado não é' : `Nenhum dos ${selecionadosOk.length} selecionados é`} qualificado para ${CAMPANHAS[campanha].nome} (mínimo ${minimo} pontos). ` +
        'Mude a pontuação mínima na engrenagem ou desligue "Enviar só para leads qualificados".',
      true,
    );
    return;
  }
  const lim = { ...LIMITES_PADRAO, ...wa.limites };
  const idSessao = wa.sessoes?.[campanha] || wa.sessao;
  const nomeNumero = wa.sessoesNome?.[idSessao] || (idSessao === wa.sessao ? wa.sessaoNome : '') || idSessao;
  const foraDoPerfil = campanha === 'locarion' ? alvos.filter((l) => perfilLocarion(l) === 'fora').length : 0;
  const ok = confirm(
    `Enviar "${CAMPANHAS[campanha].nome}" para ${alvos.length} lead${alvos.length > 1 ? 's' : ''} pelo WhatsApp?\n` +
      `Número que envia: ${nomeNumero}\n\n` +
      (deFora ? `${deFora} dos ${selecionadosOk.length} selecionados ficaram de fora por não serem qualificados (mínimo ${minimo} pontos).\n\n` : '') +
      (foraDoPerfil ? `Atenção: ${foraDoPerfil} deles não parecem locadora de equipamento de obra.\n\n` : '') +
      `Um envio a cada ${Math.round((lim.intervaloMin / 60) * 10) / 10}–${Math.round((lim.intervaloMax / 60) * 10) / 10} min, até ${lim.porDia} por dia. ` +
      'Continua mesmo com a extensão fechada (o Chrome precisa ficar aberto).',
  );
  if (!ok) return;
  chrome.runtime.sendMessage({ tipo: 'iniciarEnvio', ids: alvos.map((l) => l.id), campanha });
  selecionados.clear();
  render();
}

$('btn-prospectar-opus').addEventListener('click', () => prospectar('opus'));
$('btn-prospectar-locarion').addEventListener('click', () => prospectar('locarion'));
$('btn-prospectar-videomaker').addEventListener('click', () => prospectar('videomaker'));

$('btn-parar-envio').addEventListener('click', () => chrome.runtime.sendMessage({ tipo: 'pararEnvio' }));

const relogio = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function renderEnvio() {
  const e = envio;
  if (e?.erro) aviso(`Envio pelo WhatsApp parado: ${e.erro}`, true);
  $('envio').hidden = !e?.ativo;
  if (!e?.ativo) return;
  const feitos = e.feitos || 0;
  const total = e.total || feitos + e.fila.length;
  let texto = `WhatsApp: ${feitos} de ${total}`;
  if (e.pausa === 'limite') texto += ' · limite do dia atingido, continua amanhã';
  else if (e.proximoEm) texto += ` · próximo em ${relogio(e.proximoEm - Date.now())}`;
  else texto += ' · enviando…';
  $('envio-texto').textContent = texto;
}

setInterval(() => envio?.ativo && renderEnvio(), 1000);

// ---------- Configuração (WA-AKG e mensagens) ----------

let vertenteConfig = 'opus';
let sessoesEdit = {};
let listaSessoes = [];
let textosEdit = { opus: {}, locarion: {}, videomaker: {} };
const CAMPOS_LIM = ['intervaloMin', 'intervaloMax', 'porDia'];

function preencherConfig() {
  $('wa-url').value = wa?.url || '';
  opcoesSessao(wa?.sessao ? [{ id: wa.sessao, nome: wa.sessaoNome || wa.sessao }] : [], wa?.sessao, 'Preencha endereço e chave');
  $('wa-chave').value = wa?.chave || '';
  $('wa-seuNome').value = wa?.seuNome || '';
  $('so-qualificados').checked = wa?.soQualificados !== false;
  $('pont-minima').value = wa?.pontuacaoMinima ?? PONTUACAO_MINIMA;
  sessoesEdit = { ...wa?.sessoes };
  const nomes = { ...wa?.sessoesNome, ...(wa?.sessao ? { [wa.sessao]: wa.sessaoNome || wa.sessao } : {}) };
  listaSessoes = [...new Set([wa?.sessao, ...Object.values(sessoesEdit)].filter(Boolean))].map((id) => ({ id, nome: nomes[id] || id }));
  textosEdit = Object.fromEntries(Object.keys(CAMPANHAS).map((c) => [c, { ...textosPersonalizados(wa, c) }]));
  renderCamposMsg();
  for (const k of CAMPOS_LIM) $(`lim-${k}`).value = wa?.limites?.[k] ?? LIMITES_PADRAO[k];
  atualizarPrevia();
}

// Aceita "wa.site.com", "ttps://wa.site.com" etc.: vira https://host, sem barra no fim.
// Servidor no próprio computador (localhost) fica em http, que é como ele responde.
function normalizarUrl(valor) {
  const host = valor.trim().replace(/^[a-z]*:\/\/+|^\/+/i, '').replace(/\/+$/, '');
  if (!host) return '';
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host) ? `http://${host}` : `https://${host}`;
}

function lerConfig() {
  const textos = {};
  for (const [c, def] of Object.entries(CAMPANHAS)) {
    textos[c] = {};
    for (const k of Object.keys(def.mensagens)) {
      const v = (textosEdit[c]?.[k] || '').trim();
      if (v && v !== def.mensagens[k]) textos[c][k] = v;
    }
  }
  const n = (k) => Number($(`lim-${k}`).value) || LIMITES_PADRAO[k];
  const intervaloMin = Math.max(20, n('intervaloMin'));
  return {
    url: normalizarUrl($('wa-url').value),
    sessao: $('wa-sessao').value,
    sessaoNome: $('wa-sessao').selectedOptions[0]?.dataset.nome || '',
    chave: $('wa-chave').value.trim(),
    seuNome: $('wa-seuNome').value.trim(),
    soQualificados: $('so-qualificados').checked,
    pontuacaoMinima: Math.min(100, Math.max(0, Number($('pont-minima').value) || PONTUACAO_MINIMA)),
    sessoes: Object.fromEntries(Object.entries(sessoesEdit).filter(([, id]) => id && id !== $('wa-sessao').value)),
    sessoesNome: Object.fromEntries(listaSessoes.map((s) => [s.id, s.nome])),
    textos,
    limites: { intervaloMin, intervaloMax: Math.max(intervaloMin + 10, n('intervaloMax')), porDia: Math.min(300, Math.max(1, n('porDia'))) },
  };
}

const EXEMPLO = {
  opus: { nome: 'Clínica Exemplo', temSite: false, analise: 'ok' },
  locarion: { nome: 'V7 Locações', categoria: 'Aluguel de equipamentos de construção', temSite: true, analise: 'ok' },
  videomaker: { nome: 'Restaurante Exemplo', categoria: 'Restaurante', temSite: true, analise: 'ok', instagram: 'https://instagram.com/restauranteexemplo' },
};

function atualizarPrevia() {
  const doTipo = (l) => (vertenteConfig === 'locarion' ? perfilLocarion(l) === 'obra' : vertenteConfig === 'videomaker' ? Boolean(l.instagram) : true);
  const exemplo = leads.find((l) => selecionados.has(l.id) && doTipo(l)) || leads.find(doTipo) || EXEMPLO[vertenteConfig];
  $('previa').textContent = montarMensagem(exemplo, lerConfig(), vertenteConfig);
}

// Número que envia a vertente: o padrão (Opus) ou outra sessão do mesmo WA-AKG.
function renderSessaoVertente() {
  const sel = $('wa-sessao-vertente');
  const atual = sessoesEdit[vertenteConfig] || '';
  sel.replaceChildren(
    el('option', { value: '', textContent: 'Número padrão (Opus)', selected: !atual }),
    ...listaSessoes.map((s) =>
      el('option', {
        value: s.id,
        selected: s.id === atual,
        textContent: s.status ? `${s.nome} · ${s.status === 'CONNECTED' ? 'conectado' : 'desconectado'}` : s.nome,
      }),
    ),
  );
}

$('wa-sessao-vertente').addEventListener('change', (e) => {
  sessoesEdit[vertenteConfig] = e.target.value;
});

// Um campo de texto por modelo da vertente escolhida na engrenagem.
function renderCamposMsg() {
  const def = CAMPANHAS[vertenteConfig];
  document.querySelectorAll('.abas button').forEach((b) => b.classList.toggle('ativa', b.dataset.vertente === vertenteConfig));
  renderSessaoVertente();
  $('msg-campos').replaceChildren(
    ...Object.keys(def.mensagens).map((k) => {
      const area = el('textarea', { rows: 6, value: textosEdit[vertenteConfig][k] || def.mensagens[k] });
      area.addEventListener('input', () => {
        textosEdit[vertenteConfig][k] = area.value;
        atualizarPrevia();
      });
      return el('label', {}, def.rotulos[k], area);
    }),
  );
  atualizarPrevia();
}

document.querySelectorAll('.abas button').forEach((b) =>
  b.addEventListener('click', () => {
    vertenteConfig = b.dataset.vertente;
    renderCamposMsg();
  }),
);

function opcoesSessao(sessoes, atual, vazio) {
  const sel = $('wa-sessao');
  if (!sessoes.length) {
    sel.replaceChildren(el('option', { value: '', textContent: vazio }));
    return;
  }
  sel.replaceChildren(
    ...(atual ? [] : [el('option', { value: '', textContent: 'Escolha o número…', selected: true })]),
    ...sessoes.map((s) => {
      const o = el('option', {
        value: s.id,
        selected: s.id === atual,
        textContent: s.status ? `${s.nome} · ${s.status === 'CONNECTED' ? 'conectada' : 'desconectada'}` : s.nome,
      });
      o.dataset.nome = s.nome;
      return o;
    }),
  );
}

// Busca as sessões do servidor assim que endereço e chave estão preenchidos.
async function carregarSessoes() {
  const url = normalizarUrl($('wa-url').value);
  const chave = $('wa-chave').value.trim();
  const atual = $('wa-sessao').value || wa?.sessao;
  const r = $('teste-resultado');
  if (!url || !chave) return opcoesSessao([], '', 'Preencha endereço e chave');
  opcoesSessao([], '', 'Carregando…');
  const resp = await chrome.runtime.sendMessage({ tipo: 'listarSessoes', wa: { url, chave } });
  if (!resp?.ok) {
    opcoesSessao([], '', '—');
    r.textContent = resp?.erro || 'Falhou.';
    r.className = 'erro';
    return;
  }
  r.textContent = '';
  // Só escolhe sozinha quando há uma única sessão: com várias (ex: a do Locarion), a pessoa decide o número.
  const escolhida = resp.sessoes.some((s) => s.id === atual) ? atual : resp.sessoes.length === 1 ? resp.sessoes[0].id : '';
  opcoesSessao(resp.sessoes, escolhida, 'Nenhuma sessão: crie uma no painel');
  listaSessoes = resp.sessoes;
  renderSessaoVertente();
}

function abrirConfig() {
  preencherConfig();
  $('teste-resultado').textContent = '';
  $('config').hidden = false;
  if ($('wa-url').value && $('wa-chave').value) carregarSessoes();
}

$('wa-url').addEventListener('change', carregarSessoes);
$('wa-chave').addEventListener('change', carregarSessoes);

$('btn-config').addEventListener('click', abrirConfig);
$('btn-fechar-config').addEventListener('click', () => ($('config').hidden = true));
$('wa-seuNome').addEventListener('input', atualizarPrevia);

$('btn-padrao').addEventListener('click', () => {
  textosEdit[vertenteConfig] = {};
  renderCamposMsg();
});

$('btn-testar').addEventListener('click', async () => {
  const c = lerConfig();
  const r = $('teste-resultado');
  if (!c.url || !c.chave || !c.sessao) {
    r.textContent = 'Preencha endereço e chave e escolha a sessão.';
    r.className = 'erro';
    return;
  }
  $('wa-url').value = c.url;
  r.textContent = 'Testando…';
  r.className = '';
  const resp = await chrome.runtime.sendMessage({ tipo: 'testarWa', wa: c });
  r.textContent = resp?.ok ? 'Conectado ✓' : resp?.erro || 'Falhou.';
  r.className = resp?.ok ? 'ok' : 'erro';
});

$('btn-salvar').addEventListener('click', async () => {
  await store.set({ wa: lerConfig() });
  $('config').hidden = true;
});

function progresso(texto, fracao, { parar = false } = {}) {
  $('progresso').hidden = !texto;
  $('status-texto').textContent = texto || '';
  $('barra').style.width = `${Math.round(Math.min(1, fracao || 0) * 100)}%`;
  $('btn-parar').hidden = !parar;
}

function aviso(texto, erro = false) {
  $('aviso').hidden = !texto;
  $('aviso').textContent = texto || '';
  $('aviso').classList.toggle('erro', erro);
}

function renderProgresso() {
  const s = ultimoScan;
  $('btn-acao').disabled = Boolean(s?.ativo || busca?.ativo) || !/^https?:/.test(aba?.url || '');
  const resumo =
    busca && !busca.ativo && (busca.erro || busca.fim)
      ? busca.erro || `Pesquisa ${busca.cancelar ? 'parada' : 'concluída'}: ${busca.novos} leads novos (${busca.cancelar ? `${busca.indice + 1} de ${busca.nichos.length}` : busca.nichos.length} nicho${busca.nichos.length === 1 ? '' : 's'} em ${busca.cidade}).`
      : '';
  aviso(s?.erro || resumo, Boolean(s?.erro || busca?.erro));
  if (busca?.ativo) {
    const dentro = s?.ativo ? Math.min(1, (s.total || 0) / (busca.maximo || 40)) : 0;
    return progresso(
      busca.cancelar
        ? 'Parando… termina o nicho atual e fecha a aba do Maps'
        : `Pesquisando "${busca.atual}" em ${busca.cidade}… nicho ${busca.indice + 1} de ${busca.nichos.length} · ${leads.length} leads`,
      (busca.indice + dentro) / busca.nichos.length,
      { parar: true },
    );
  }
  if (s?.ativo) return progresso(`Lendo o Maps… ${s.total} empresas`, s.total / MAX_MAPS, { parar: true });

  const pendentes = leads.filter((l) => l.analise === 'pendente').length;
  loteAnalise = pendentes ? Math.max(loteAnalise, pendentes) : 0;
  if (pendentes) return progresso(`Analisando sites e redes… faltam ${pendentes}`, 1 - pendentes / loteAnalise);
  progresso('');
}

function csv(lista) {
  const esc = (v) => {
    const s = String(v ?? '');
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const linhas = [COLUNAS.map(([rotulo]) => rotulo).join(';'), ...lista.map((l) => COLUNAS.map(([, f]) => esc(f(l))).join(';'))];
  // BOM + ";" para o Excel em português abrir com acentos e colunas certas.
  return '﻿' + linhas.join('\r\n');
}

const ehMaps = () => /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(aba?.url || '');

// ---------- Ações ----------

$('btn-acao').addEventListener('click', async () => {
  if (ehMaps()) {
    await store.set({ scan: { ativo: true, total: 0 } });
    chrome.scripting
      .executeScript({ target: { tabId: aba.id }, func: varrerGoogleMaps, args: [MAX_MAPS] })
      .catch((e) => store.set({ scan: { ativo: false, erro: `Não deu pra ler o Maps (${e.message}).` } }));
    return;
  }
  try {
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: aba.id }, func: capturarPagina });
    const porId = new Map(leads.map((l) => [l.id, l]));
    porId.set(result.id, { ...porId.get(result.id), ...result });
    await store.set({ leads: [...porId.values()], scan: null });
    chrome.runtime.sendMessage({ tipo: 'enriquecer' });
  } catch (e) {
    aviso(`Não deu pra ler esta página (${e.message}).`, true);
  }
});

$('btn-parar').addEventListener('click', async () => {
  if (busca?.ativo) chrome.runtime.sendMessage({ tipo: 'pararPesquisa' });
  const { scan } = await store.get('scan');
  await store.set({ scan: { ...scan, cancelar: true } });
});

$('btn-csv').addEventListener('click', () => {
  const blob = new Blob([csv(visiveis())], { type: 'text/csv;charset=utf-8' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `leads-opus-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$('btn-limpar').addEventListener('click', () => {
  if (confirm(`Apagar os ${leads.length} leads salvos?`)) store.set({ leads: [], scan: null });
});

document.querySelectorAll('.bloco').forEach((b) =>
  b.addEventListener('click', () => {
    filtro = filtro === b.dataset.filtro ? '' : b.dataset.filtro;
    render();
  }),
);

chrome.storage.onChanged.addListener((mudancas, area) => {
  if (area !== 'local' || !(mudancas.scan || mudancas.leads || mudancas.envio || mudancas.wa || mudancas.busca)) return;
  if (mudancas.wa) wa = mudancas.wa.newValue;
  if (mudancas.busca) {
    busca = mudancas.busca.newValue;
    // Ao terminar uma pesquisa, mostra só os leads qualificados para facilitar a escolha.
    if (busca?.fim && !mudancas.busca.oldValue?.fim) soQualificadosFiltro = true;
  }
  if (mudancas.envio) envio = mudancas.envio.newValue;
  if (mudancas.scan) ultimoScan = mudancas.scan.newValue;
  if (mudancas.leads) leads = mudancas.leads.newValue || [];
  render();
});

// ---------- Pesquisa automática (Videomaker) ----------
// Pesquisa "nicho em cidade" no Maps, um nicho por vez, numa aba própria (o background cuida disso).

const NICHOS = ['restaurante', 'clínica de estética', 'academia', 'pousada', 'imobiliária', 'barbearia', 'salão de beleza', 'clínica odontológica', 'pet shop', 'hamburgueria'];
const salvarPesquisa = () => store.set({ pesquisaConfig: pesquisa });

function renderPesquisa() {
  const ocupado = Boolean(busca?.ativo);
  $('btn-pesquisa').disabled = ocupado;
  $('pesq-nichos').replaceChildren(
    ...[...NICHOS, ...pesquisa.extras].map((n) => {
      const b = el('button', { type: 'button', className: 'chip', textContent: n });
      b.setAttribute('aria-pressed', String(pesquisa.escolhidos.includes(n)));
      b.addEventListener('click', () => {
        pesquisa.escolhidos = pesquisa.escolhidos.includes(n) ? pesquisa.escolhidos.filter((x) => x !== n) : [...pesquisa.escolhidos, n];
        salvarPesquisa();
        renderPesquisa();
      });
      return b;
    }),
  );
  const n = pesquisa.escolhidos.length;
  comIcone($('btn-pesquisar'), 'busca', ` Pesquisar ${n} nicho${n === 1 ? '' : 's'}`);
  $('btn-pesquisar').disabled = ocupado || !n || !$('pesq-cidade').value.trim();
}

$('btn-pesquisa').addEventListener('click', () => {
  const aberto = $('pesquisa').hidden;
  $('pesquisa').hidden = !aberto;
  $('btn-pesquisa').setAttribute('aria-expanded', String(aberto));
  if (aberto) $('pesq-cidade').focus();
});

$('pesq-cidade').addEventListener('input', () => {
  pesquisa.cidade = $('pesq-cidade').value.trim();
  salvarPesquisa();
  renderPesquisa();
});

function adicionarNicho() {
  const n = $('pesq-outro').value.trim().toLowerCase();
  if (!n) return;
  if (![...NICHOS, ...pesquisa.extras].includes(n)) pesquisa.extras.push(n);
  if (!pesquisa.escolhidos.includes(n)) pesquisa.escolhidos.push(n);
  $('pesq-outro').value = '';
  salvarPesquisa();
  renderPesquisa();
}
$('btn-outro').addEventListener('click', adicionarNicho);
$('pesq-outro').addEventListener('keydown', (e) => e.key === 'Enter' && adicionarNicho());

$('btn-pesquisar').addEventListener('click', () => {
  const cidade = $('pesq-cidade').value.trim();
  if (!cidade || !pesquisa.escolhidos.length) return;
  chrome.runtime.sendMessage({ tipo: 'pesquisar', cidade, nichos: [...pesquisa.escolhidos], maximo: 40 });
  $('pesquisa').hidden = true;
  $('btn-pesquisa').setAttribute('aria-expanded', 'false');
});

// ---------- Aba de trabalho ----------
// O painel lateral fica aberto enquanto a pessoa troca de aba ou de página.
async function atualizarAba() {
  [aba] = await chrome.tabs.query({ active: true, currentWindow: true });
  const maps = ehMaps();
  comIcone($('btn-acao'), maps ? 'busca' : 'captura', maps ? 'Buscar leads nesta pesquisa' : 'Analisar esta página');
  renderProgresso();
}

chrome.tabs.onActivated.addListener(atualizarAba);
chrome.tabs.onUpdated.addListener((id, mudanca) => {
  if (id === aba?.id && (mudanca.url || mudanca.status === 'complete')) atualizarAba();
});

// ---------- Início ----------
(async () => {
  comIcone($('btn-limpar'), 'lixo');
  comIcone($('btn-config'), 'config');
  comIcone($('btn-fechar-config'), 'fechar');
  comIcone($('btn-csv'), 'baixar', ' Exportar planilha');
  await atualizarAba();
  comIcone($('btn-pesquisa'), 'lupa', ' Pesquisar leads de vídeo');
  const dados = await store.get(['leads', 'scan', 'envio', 'wa', 'busca', 'pesquisaConfig']);
  leads = dados.leads || [];
  ultimoScan = dados.scan;
  envio = dados.envio;
  wa = dados.wa;
  busca = dados.busca;
  pesquisa = { ...pesquisa, ...dados.pesquisaConfig };
  $('pesq-cidade').value = pesquisa.cidade || '';
  render();
  if (leads.some((l) => l.analise === 'pendente')) chrome.runtime.sendMessage({ tipo: 'enriquecer' });
})();
