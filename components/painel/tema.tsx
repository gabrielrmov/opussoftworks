"use client";

import { useRef } from "react";
import { salvarTema, type Tema } from "@/lib/painel/tema";

export function AlternarTema() {
  const ref = useRef<HTMLButtonElement>(null);

  function alternar() {
    const raiz = ref.current?.closest<HTMLElement>(".pn-raiz");
    if (!raiz) return;
    const novo: Tema = raiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
    raiz.setAttribute("data-tema", novo);
    salvarTema(novo);
  }

  return (
    <button ref={ref} type="button" className="pn-ic" aria-label="Alternar tema" title="Alternar tema" onClick={alternar}>
      <svg className="pn-ic-lua" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
      </svg>
      <svg className="pn-ic-sol" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
