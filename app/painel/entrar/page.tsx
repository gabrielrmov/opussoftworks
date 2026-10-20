"use client";

import { useEffect, useState } from "react";
import { Simbolo } from "@/components/painel/marca";
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
    <main className="pn-centro">
      <div className="pn-cartao pn-entrar">
        <div className="pn-entrar-marca">
          <Simbolo />
        </div>
        <h1 className="pn-entrar-t">Painel Opus</h1>
        <p className="pn-sub">Acesso restrito à equipe.</p>
        {erro && (
          <div role="alert" className="pn-erro pn-entrar-erro">
            <p className="pn-erro-t">Não foi possível entrar</p>
            <p className="pn-erro-d">{erro}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => void entrar()}
          disabled={acesso.estado === "nao-configurado"}
          className="pn-btn pn-entrar-btn"
        >
          Entrar com Google
        </button>
      </div>
    </main>
  );
}
