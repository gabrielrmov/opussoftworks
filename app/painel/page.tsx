"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Casca } from "@/components/painel/casca";
import { Guarda } from "@/components/painel/guarda";
import { AREAS } from "@/lib/painel/areas";
import { contarEmAndamento } from "@/lib/painel/projetos";
import { useAcesso } from "@/lib/painel/use-acesso";

const CARTAO = "rounded-md border border-[#161616]/10 bg-white p-5";

function ResumoProjetos() {
  // undefined = carregando; null = falhou; número = contagem.
  const [total, setTotal] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    let cancelado = false;
    contarEmAndamento().then(
      (n) => {
        if (!cancelado) setTotal(n);
      },
      () => {
        if (!cancelado) setTotal(null);
      },
    );
    return () => {
      cancelado = true;
    };
  }, []);

  if (total === undefined) return <>Carregando…</>;
  if (total === null) return <>—</>;
  return <>{total} em andamento</>;
}

function VisaoGeral() {
  // Só renderiza dentro de <Guarda>, então o estado é "ok"; o resto é defensivo.
  const acesso = useAcesso();
  if (acesso.estado !== "ok" || !acesso.papel) return null;

  return (
    <Casca papel={acesso.papel} email={acesso.email}>
      <h1 className="text-2xl font-semibold">Visão geral</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {AREAS.map(({ nome, href }) =>
          href ? (
            <Link key={nome} href={href} className={`${CARTAO} block`}>
              <h2 className="text-base font-semibold">{nome}</h2>
              <p className="mt-2 text-sm text-[#161616]/60">
                <ResumoProjetos />
              </p>
            </Link>
          ) : (
            <section key={nome} className={CARTAO}>
              <h2 className="text-base font-semibold">{nome}</h2>
              <p className="mt-2 text-sm text-[#161616]/60">Em breve</p>
            </section>
          ),
        )}
      </div>
    </Casca>
  );
}

export default function PainelPage() {
  return (
    <Guarda>
      <VisaoGeral />
    </Guarda>
  );
}
