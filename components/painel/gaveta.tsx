"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";

type Props = {
  aberta: boolean;
  titulo: string;
  bloqueada: boolean;
  onFechar: () => void;
  acionador?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

const FOCAVEIS =
  'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function Gaveta({ aberta, titulo, bloqueada, onFechar, acionador, children }: Props) {
  const idTitulo = useId();
  const painel = useRef<HTMLDivElement>(null);
  const corpo = useRef<HTMLDivElement>(null);
  // Sempre a versão mais recente, sem reabrir/refocar a cada render.
  const bloqueadaRef = useRef(bloqueada);
  const onFecharRef = useRef(onFechar);
  const acionadorRef = useRef(acionador);
  useEffect(() => {
    bloqueadaRef.current = bloqueada;
    onFecharRef.current = onFechar;
    acionadorRef.current = acionador;
  });

  useEffect(() => {
    if (!aberta) return;
    // Capturado na abertura: acionador (se houver) ou o elemento que tinha foco.
    const retorno: HTMLElement | null =
      acionadorRef.current?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const primeiro = corpo.current?.querySelector<HTMLElement>(FOCAVEIS) ?? painel.current?.querySelector<HTMLElement>(FOCAVEIS);
    primeiro?.focus();

    function aoTeclar(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        if (ev.defaultPrevented || bloqueadaRef.current) return;
        // Esc em seletores nativos (select, data) só fecha o popup deles.
        const alvo = ev.target instanceof Element ? ev.target : null;
        if (alvo?.closest('select, input[type="date"]')) return;
        onFecharRef.current();
        return;
      }
      if (ev.key !== "Tab" || !painel.current) return;
      const itens = Array.from(painel.current.querySelectorAll<HTMLElement>(FOCAVEIS));
      if (itens.length === 0) {
        ev.preventDefault();
        painel.current.focus();
        return;
      }
      const primeiroItem = itens[0];
      const ultimo = itens[itens.length - 1];
      const ativo = document.activeElement;
      if (!painel.current.contains(ativo)) {
        ev.preventDefault();
        primeiroItem.focus();
      } else if (ev.shiftKey && ativo === primeiroItem) {
        ev.preventDefault();
        ultimo.focus();
      } else if (!ev.shiftKey && ativo === ultimo) {
        ev.preventDefault();
        primeiroItem.focus();
      }
    }
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      if (retorno && retorno.isConnected) retorno.focus();
    };
  }, [aberta]);

  if (!aberta) return null;

  return (
    <>
      <div
        data-testid="gaveta-fundo"
        className="pn-vel"
        aria-hidden="true"
        onClick={() => {
          if (!bloqueada) onFechar();
        }}
      />
      <div ref={painel} role="dialog" aria-modal="true" aria-labelledby={idTitulo} tabIndex={-1} className="pn-gav">
        <header className="pn-gav-cab">
          <h2 id={idTitulo} className="pn-gav-tit">
            {titulo}
          </h2>
          <button type="button" className="pn-ic" aria-label="Fechar" disabled={bloqueada} onClick={onFechar}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div ref={corpo} className="pn-gav-corpo">
          {children}
        </div>
      </div>
    </>
  );
}
