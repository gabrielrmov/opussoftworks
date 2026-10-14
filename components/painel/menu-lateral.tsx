"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AREAS_EM_BREVE = ["Projetos e equipe", "Clientes e comercial", "Financeiro", "Campanhas"];

function Ativo({ ativo }: { ativo: boolean }) {
  return <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${ativo ? "bg-[#FF6039]" : "bg-transparent"}`} />;
}

export function MenuLateral({ papel }: { papel: "admin" | "membro" }) {
  const pathname = usePathname();

  function item(href: string, nome: string) {
    const ativo = pathname === href;
    return (
      <li key={href}>
        <Link
          href={href}
          aria-current={ativo ? "page" : undefined}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${ativo ? "font-semibold" : "text-[#161616]/70"}`}
        >
          <Ativo ativo={ativo} />
          {nome}
        </Link>
      </li>
    );
  }

  return (
    <nav aria-label="Menu do painel">
      <ul className="flex flex-col gap-1">
        {item("/painel", "Visão geral")}
        {AREAS_EM_BREVE.map((nome) => (
          <li
            key={nome}
            aria-disabled="true"
            className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-[#161616]/40"
          >
            <span className="flex items-center gap-2">
              <Ativo ativo={false} />
              {nome}
            </span>
            <span className="text-xs">em breve</span>
          </li>
        ))}
        {papel === "admin" && item("/painel/membros", "Membros")}
      </ul>
    </nav>
  );
}
