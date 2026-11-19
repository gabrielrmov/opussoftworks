// Estas funções são injetadas na aba via chrome.scripting.executeScript({ func }).
// O Chrome serializa só o corpo da função: nada de imports nem referências externas.

// Rola a lista de resultados do Google Maps, coleta os cards e grava direto no
// chrome.storage (a varredura continua mesmo se o popup fechar). No fim, pede ao
// background para analisar os sites.
export async function varrerGoogleMaps(max) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const feed = document.querySelector('div[role="feed"]');
  if (!feed) {
    await chrome.storage.local.set({
      scan: { ativo: false, erro: 'Abra uma pesquisa no Maps (ex: "dentista em Curitiba") e tente de novo.' },
    });
    return;
  }

  const RE_TEL = /(?:\+?55\s?)?\(?\b\d{2}\)?\s?9?\d{4}[-\s.]?\d{4}\b|\+\d{1,3}[\d\s-]{8,}\d/;
  const RE_NOTA = /^\d[,.]\d(\s*\([\d.,]+\))?$/;
  const IGNORAR = /^(site|website|rotas|directions|ligar|call|patrocinado|sponsored|salvar|save|compartilhar|share)$/i;
  const vistos = new Map();

  const coletar = () => {
    for (const link of feed.querySelectorAll('a[href*="/maps/place/"]')) {
      const url = link.href.split('?')[0];
      if (vistos.has(url)) continue;
      const card = link.closest('[role="article"]') || link.parentElement;
      const nome = (link.getAttribute('aria-label') || '').trim();
      if (!nome) continue;

      let nota = '';
      let avaliacoes = '';
      const estrelas = card.querySelector('[role="img"][aria-label]');
      if (estrelas) {
        const nums = estrelas.getAttribute('aria-label').match(/\d+(?:[.,]\d+)*/g) || [];
        nota = nums[0] || '';
        avaliacoes = (nums[1] || '').replace(/[.,]/g, '');
      }

      const texto = card.innerText || '';
      const telefone = (texto.match(RE_TEL) || [''])[0].trim();
      const patrocinado = /^(patrocinado|sponsored)$/im.test(texto);

      const linhas = texto
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && l !== nome && !RE_NOTA.test(l) && !IGNORAR.test(l));
      let categoria = '';
      let endereco = '';
      const info = linhas.find((l) => l.includes('·'));
      if (info) {
        const partes = info
          .split('·')
          .map((p) => p.trim())
          .filter((p) => p && !RE_TEL.test(p));
        categoria = partes[0] || '';
        endereco = partes.length > 1 ? partes[partes.length - 1] : '';
      }

      // Em anúncios o botão aponta para o redirecionador pago do Google (/aclk):
      // não guardamos esse link para nunca gerar clique cobrado.
      const botaoSite = card.querySelector('a[data-value="Website"]');
      const site = botaoSite && !/\/aclk\?/.test(botaoSite.href) ? botaoSite.href : '';

      vistos.set(url, {
        id: url,
        nome,
        categoria,
        telefone,
        site,
        temSite: Boolean(botaoSite),
        endereco,
        nota,
        avaliacoes,
        anunciaGoogle: patrocinado,
        fonte: 'Google Maps',
        url,
        analise: 'pendente',
        capturadoEm: new Date().toISOString(),
      });
    }
  };

  await chrome.storage.local.set({ scan: { ativo: true, total: 0 } });
  let anterior = -1;
  let parado = 0;
  while (true) {
    coletar();
    const { scan } = await chrome.storage.local.get('scan');
    if (scan?.cancelar) break;
    await chrome.storage.local.set({ scan: { ativo: true, total: Math.min(vistos.size, max) } });
    if (vistos.size >= max) break;
    if (/final da lista|end of the list/i.test(feed.innerText.slice(-400))) break;
    parado = vistos.size === anterior ? parado + 1 : 0;
    if (parado >= 4) break;
    anterior = vistos.size;
    feed.scrollTo(0, feed.scrollHeight);
    feed.lastElementChild?.scrollIntoView({ block: 'end' });
    await sleep(1500 + Math.random() * 1000);
  }

  const novos = [...vistos.values()].slice(0, max);
  const { leads = [] } = await chrome.storage.local.get('leads');
  const porId = new Map(leads.map((l) => [l.id, l]));
  for (const l of novos) porId.set(l.id, { ...porId.get(l.id), ...l });
  await chrome.storage.local.set({
    leads: [...porId.values()],
    scan: { ativo: false, total: novos.length, fim: true },
  });
  chrome.runtime.sendMessage({ tipo: 'enriquecer' });
}

// Página aberta (site, Instagram, link na bio…): vira um lead e o background analisa.
export function capturarPagina() {
  const meta = (p) => document.querySelector(`meta[property="${p}"], meta[name="${p}"]`)?.content?.trim() || '';
  return {
    id: location.hostname.replace(/^www\./, '') + (/instagram|facebook|linktr/.test(location.hostname) ? location.pathname : ''),
    nome: meta('og:site_name') || meta('og:title') || document.title.split(/[|\-–—]/)[0].trim() || location.hostname,
    site: location.href,
    temSite: true,
    fonte: 'Página',
    url: location.href,
    analise: 'pendente',
    capturadoEm: new Date().toISOString(),
  };
}
