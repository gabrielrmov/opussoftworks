"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Simbolo } from "./marca";
import { sair, useAcesso } from "@/lib/painel/use-acesso";

function Aviso({ titulo, texto, children }: { titulo: string; texto?: string; children?: ReactNode }) {
  return (
    <div className="pn-centro">
      <div role="status" className="pn-cartao pn-entrar">
        <div className="pn-entrar-marca">
          <Simbolo />
        </div>
        <h1 className="pn-entrar-t">{titulo}</h1>
        {texto && <p className="pn-sub">{texto}</p>}
        {children}
      </div>
    </div>
  );
}

function BotaoSair() {
  return (
    <button
      type="button"
      onClick={() => void sair()}
      className="pn-btn pn-btn-sec pn-entrar-btn"
    >
      Sair
    </button>
  );
}

export function Guarda({ papel, children }: { papel?: "admin"; children: ReactNode }) {
  const acesso = useAcesso();
  const router = useRouter();

  useEffect(() => {
    if (acesso.estado === "sem-sessao") {
      router.replace("/painel/entrar" + window.location.search);
    }
  }, [acesso.estado, router]);

  switch (acesso.estado) {
    case "ok":
      if (papel === "admin" && acesso.papel !== "admin") {
        return (
          <Aviso
            titulo="Sem permissão"
            texto="Você não tem permissão para acessar esta área. Fale com um administrador."
          />
        );
      }
      return <>{children}</>;
    case "sem-acesso":
      return (
        <Aviso titulo="Você não tem acesso a este painel" texto={acesso.email}>
          <BotaoSair />
        </Aviso>
      );
    case "nao-configurado":
      return <Aviso titulo="Painel ainda não configurado" />;
    default:
      return (
        <div className="pn-centro">
          <div role="status" aria-label="Carregando" className="pn-mudo">
            Carregando…
          </div>
        </div>
      );
  }
}
