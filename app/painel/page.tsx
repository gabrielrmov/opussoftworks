"use client";

import { Casca } from "@/components/painel/casca";
import { Guarda } from "@/components/painel/guarda";
import { useAcesso } from "@/lib/painel/use-acesso";

const AREAS = ["Projetos e equipe", "Clientes e comercial", "Financeiro", "Campanhas"];

function VisaoGeral() {
  // Só renderiza dentro de <Guarda>, então o estado é "ok"; o resto é defensivo.
  const acesso = useAcesso();
  if (acesso.estado !== "ok" || !acesso.papel) return null;

  return (
    <Casca papel={acesso.papel} email={acesso.email}>
      <h1 className="text-2xl font-semibold">Visão geral</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {AREAS.map((area) => (
          <section key={area} className="rounded-md border border-[#161616]/10 bg-white p-5">
            <h2 className="text-base font-semibold">{area}</h2>
            <p className="mt-2 text-sm text-[#161616]/60">Em breve</p>
          </section>
        ))}
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
