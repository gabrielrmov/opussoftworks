"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Casca } from "@/components/painel/casca";
import { Guarda } from "@/components/painel/guarda";
import {
  adicionarMembro,
  definirAtivo,
  listarMembros,
  mensagemDeErro,
  type Membro,
  type Papel,
} from "@/lib/painel/membros";
import { useAcesso } from "@/lib/painel/use-acesso";

function Gestao({ meuEmail }: { meuEmail?: string }) {
  const [membros, setMembros] = useState<Membro[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState<Papel>("membro");
  const [ocupado, setOcupado] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setMembros(await listarMembros());
    } catch (e) {
      setErro(mensagemDeErro(e));
      setMembros((atual) => atual ?? []);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function executar(acao: () => Promise<void>): Promise<boolean> {
    setErro(null);
    setOcupado(true);
    try {
      await acao();
      await carregar();
      return true;
    } catch (e) {
      setErro(mensagemDeErro(e));
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function aoAdicionar(ev: FormEvent) {
    ev.preventDefault();
    if (await executar(() => adicionarMembro(email, papel))) setEmail("");
  }

  const meu = meuEmail?.trim().toLowerCase();

  return (
    <>
      <h1 className="text-2xl font-semibold">Membros</h1>

      <form onSubmit={aoAdicionar} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="novo-email" className="text-sm font-medium">E-mail</label>
          <input
            id="novo-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-[#161616]/20 bg-white px-3 py-2 text-sm sm:w-72"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="novo-papel" className="text-sm font-medium">Papel</label>
          <select
            id="novo-papel"
            value={papel}
            onChange={(e) => setPapel(e.target.value as Papel)}
            className="rounded-md border border-[#161616]/20 bg-white px-3 py-2 text-sm"
          >
            <option value="membro">Membro</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={ocupado}
          className="rounded-md bg-[#FF6039] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>

      {erro && (
        <p role="alert" className="mt-4 text-sm font-medium text-[#B3261E]">
          {erro}
        </p>
      )}

      <div className="mt-6">
        {membros === null ? (
          <p role="status" className="text-sm text-[#161616]/60">Carregando…</p>
        ) : membros.length === 0 ? (
          <p className="text-sm text-[#161616]/60">Nenhum membro cadastrado.</p>
        ) : (
          <ul className="divide-y divide-[#161616]/10 rounded-md border border-[#161616]/10 bg-white">
            {membros.map((m) => {
              const proprio = m.email.toLowerCase() === meu;
              const bloqueado = proprio && m.ativo;
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 break-all font-medium">{m.email}</span>
                  <span className="text-[#161616]/70">{m.papel === "admin" ? "Admin" : "Membro"}</span>
                  <span className="text-[#161616]/70">{m.ativo ? "Ativo" : "Inativo"}</span>
                  <button
                    type="button"
                    disabled={ocupado || bloqueado}
                    aria-describedby={bloqueado ? `aviso-${m.id}` : undefined}
                    onClick={() => void executar(() => definirAtivo(m.id, !m.ativo))}
                    className="rounded-md border border-[#161616]/20 px-3 py-1.5 font-medium disabled:opacity-50"
                  >
                    {m.ativo ? "Desativar" : "Ativar"}
                  </button>
                  {bloqueado && (
                    <span id={`aviso-${m.id}`} className="w-full text-xs text-[#161616]/60">
                      Você não pode desativar a si mesmo.
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function Conteudo() {
  const acesso = useAcesso();
  if (acesso.estado !== "ok" || !acesso.papel) return null;
  return (
    <Casca papel={acesso.papel} email={acesso.email}>
      <Gestao meuEmail={acesso.email} />
    </Casca>
  );
}

export default function MembrosPage() {
  return (
    <Guarda papel="admin">
      <Conteudo />
    </Guarda>
  );
}
