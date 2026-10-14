"use client";

import type { ReactNode } from "react";
import { sair } from "@/lib/painel/use-acesso";
import { MenuLateral } from "./menu-lateral";

export function Casca({
  papel,
  email,
  children,
}: {
  papel: "admin" | "membro";
  email?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col gap-6 border-b border-[#161616]/10 p-4 md:w-64 md:shrink-0 md:justify-between md:border-b-0 md:border-r">
        <div>
          <p className="px-3 pb-4 text-base font-semibold">Painel Opus</p>
          <MenuLateral papel={papel} />
        </div>
        <div className="px-3 text-sm">
          {email && <p className="break-all text-[#161616]/70">{email}</p>}
          <button
            type="button"
            onClick={() => void sair()}
            className="mt-2 rounded-md border border-[#161616]/20 px-3 py-1.5 text-sm font-medium"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
