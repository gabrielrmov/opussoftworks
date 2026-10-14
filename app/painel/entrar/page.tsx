"use client";

import { useEffect, useState } from "react";
import { entrarComGoogle } from "@/lib/painel/use-acesso";

export default function EntrarPage() {
  const [erro, setErro] = useState<string | null>(null);

  // Lido em efeito: o prerender estático não tem window.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setErro(params.get("error_description") || params.get("error"));
  }, []);

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
        onClick={() => void entrarComGoogle()}
        className="mt-8 w-full rounded-md bg-[#FF6039] px-4 py-3 text-sm font-semibold text-white"
      >
        Entrar com Google
      </button>
    </main>
  );
}
