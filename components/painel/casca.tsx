"use client";

import type { ReactNode } from "react";
import { sair } from "@/lib/painel/use-acesso";
import { MenuLateral } from "./menu-lateral";
import { AlternarTema } from "./tema";

export function Casca({
  papel,
  email,
  acaoTopo,
  children,
}: {
  papel: "admin" | "membro";
  email?: string;
  acaoTopo?: ReactNode;
  children: ReactNode;
}) {
  const inicial = email ? email.trim().charAt(0).toUpperCase() : "";
  return (
    <div className="pn-app">
      <aside className="pn-lateral">
        <div className="pn-marca">
          <svg aria-hidden="true" viewBox="0 0 60 36" fill="none">
            <path
              d="M30 18C24 8 14 4 9 9s-1 15 8 15c7 0 10-6 13-6s6 6 13 6c9 0 13-10 8-15s-15-1-21 9Z"
              stroke="#FF6039"
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <b>Opus</b>
            <span>SoftWorks</span>
          </div>
        </div>
        <MenuLateral papel={papel} />
        <div className="pn-usuario">
          <div className="pn-usuario-lin">
            {inicial && (
              <span className="pn-av" aria-hidden="true">
                {inicial}
              </span>
            )}
            {email && <span>{email}</span>}
          </div>
          <button type="button" className="pn-sair" onClick={() => void sair()}>
            Sair
          </button>
        </div>
      </aside>
      <div className="pn-col">
        <div className="pn-topo">
          <div className="pn-espaco" />
          <AlternarTema />
          {acaoTopo}
        </div>
        <main className="pn-conteudo">{children}</main>
      </div>
    </div>
  );
}
