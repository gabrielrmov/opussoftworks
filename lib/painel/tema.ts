export type Tema = "claro" | "escuro";

export const CHAVE_TEMA = "painel-tema";

export function lerTema(): Tema {
  try {
    return localStorage.getItem(CHAVE_TEMA) === "escuro" ? "escuro" : "claro";
  } catch {
    return "claro";
  }
}

export function salvarTema(t: Tema): void {
  try {
    localStorage.setItem(CHAVE_TEMA, t);
  } catch {
    // armazenamento indisponível: o tema só vale nesta visita
  }
}

// Autocontido: roda antes da pintura e aplica o tema salvo no elemento pai do <script>.
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem(${JSON.stringify(CHAVE_TEMA)});var e=document.currentScript&&document.currentScript.parentElement;if(e)e.setAttribute("data-tema",t==="escuro"?"escuro":"claro")}catch(_){}})()`;
