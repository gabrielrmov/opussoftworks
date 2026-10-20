"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AREAS } from "@/lib/painel/areas";

function Icone({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ICONES: Record<string, ReactNode> = {
  "Visão geral": (
    <Icone>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icone>
  ),
  "Projetos e equipe": (
    <Icone>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Icone>
  ),
  "Clientes e comercial": (
    <Icone>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a3 3 0 1 0 0-6M21 20c0-2.6-1.6-4.8-4-5.6" />
    </Icone>
  ),
  Financeiro: (
    <Icone>
      <path d="M12 3v18M16.5 7.5c-.8-1.2-2.4-2-4.5-2-2.6 0-4.5 1.3-4.5 3.2 0 4.3 9 2.1 9 6.4 0 1.9-1.9 3.4-4.5 3.4-2.2 0-3.9-.9-4.7-2.3" />
    </Icone>
  ),
  Campanhas: (
    <Icone>
      <path d="M3 17l5-5 4 4 8-9M15 7h5v5" />
    </Icone>
  ),
  Membros: (
    <Icone>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Icone>
  ),
};

export function MenuLateral({ papel }: { papel: "admin" | "membro" }) {
  const pathname = usePathname();

  function item(href: string, nome: string) {
    const ativo = pathname === href;
    return (
      <li key={href}>
        <Link href={href} aria-current={ativo ? "page" : undefined} className={`pn-nav-item${ativo ? " pn-ativo" : ""}`}>
          {ICONES[nome]}
          {nome}
        </Link>
      </li>
    );
  }

  const comLink = AREAS.filter((a) => a.href);
  const emBreve = AREAS.filter((a) => !a.href);

  return (
    <nav aria-label="Menu do painel" className="pn-nav">
      <ul>
        {item("/painel", "Visão geral")}
        {comLink.map(({ nome, href }) => item(href as string, nome))}
        {emBreve.length > 0 && (
          <li className="pn-rot">
            Em breve
          </li>
        )}
        {emBreve.map(({ nome }) => (
          <li key={nome} aria-disabled="true" className="pn-nav-item pn-breve">
            {ICONES[nome]}
            <span>{nome}</span>
            <small>em breve</small>
          </li>
        ))}
        {papel === "admin" && (
          <>
            <li className="pn-rot">
              Administração
            </li>
            {item("/painel/membros", "Membros")}
          </>
        )}
      </ul>
    </nav>
  );
}
