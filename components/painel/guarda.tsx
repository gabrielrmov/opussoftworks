"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { sair, useAcesso } from "@/lib/painel/use-acesso";

function Aviso({ titulo, texto, children }: { titulo: string; texto?: string; children?: ReactNode }) {
  return (
    <div role="status" className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-xl font-semibold">{titulo}</h1>
      {texto && <p className="mt-2 text-sm text-[#161616]/70">{texto}</p>}
      {children}
    </div>
  );
}

function BotaoSair() {
  return (
    <button
      type="button"
      onClick={() => void sair()}
      className="mt-6 rounded-md border border-[#161616]/20 px-4 py-2 text-sm font-medium"
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
        <div role="status" aria-label="Carregando" className="py-24 text-center text-sm text-[#161616]/60">
          Carregando…
        </div>
      );
  }
}
