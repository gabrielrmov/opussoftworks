"use client";

import { useEffect, useState } from "react";
import { entrarComGoogle, useAcesso } from "@/lib/painel/use-acesso";

const MSG_NAO_AUTORIZADA = "Esta conta Google não está autorizada a acessar o painel.";
const MSG_GENERICA = "Não foi possível entrar. Tente novamente.";

// Nunca exibe o texto vindo da URL (controlável por terceiros): só mensagens fixas.
function mensagemDeErro(): string | null {
  const consultas = [
    new URLSearchParams(window.location.search),
    new URLSearchParams(window.location.hash.replace(/^#/, "")),
  ];
  let presente = false;
  for (const p of consultas) {
    const erro = p.get("error");
    const descricao = p.get("error_description");
    const codigo = p.get("error_code");
    if (!erro && !descricao && !codigo) continue;
    presente = true;
    const texto = `${erro ?? ""} ${descricao ?? ""} ${codigo ?? ""}`.toLowerCase();
    if (/acesso restrito|access_denied|hook/.test(texto)) return MSG_NAO_AUTORIZADA;
  }
  return presente ? MSG_GENERICA : null;
}

export default function EntrarPage() {
  const [erro, setErro] = useState<string | null>(null);
  const acesso = useAcesso();

  // Lido em efeito: o prerender estático não tem window.
  useEffect(() => {
    setErro(mensagemDeErro());
  }, []);

  async function entrar() {
    try {
      await entrarComGoogle();
    } catch {
      setErro(MSG_GENERICA);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Painel Opus</h1>
      <p className="mt-2 text-sm text-[#161616]/70">Acesso restrito à equipe.</p>
      {erro && (
        <div role="alert" className="mt-6 rounded-md border border-[#161616]/20 p-3 text-left text-sm">
          <p className="font-semibold">Não foi possível entrar</p>
          <p className="mt-1 break-words text-[#161616]/70">{erro}</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => void entrar()}
        disabled={acesso.estado === "nao-configurado"}
        className="mt-8 w-full rounded-md bg-[#FF6039] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Entrar com Google
      </button>
    </main>
  );
}
