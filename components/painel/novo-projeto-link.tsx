"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export const EVENTO_NOVO_PROJETO = "painel:novo-projeto";

// Link para "novo projeto". Se já estamos na página de projetos (que não remonta
// ao mudar só a query), avisa a página por evento em vez de navegar.
export function NovoProjetoLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Link
      href="/painel/projetos?novo=1"
      className={className}
      onClick={(ev) => {
        if (window.location.pathname.replace(/\/$/, "") === "/painel/projetos") {
          ev.preventDefault();
          window.dispatchEvent(new Event(EVENTO_NOVO_PROJETO));
        }
      }}
    >
      {children}
    </Link>
  );
}
