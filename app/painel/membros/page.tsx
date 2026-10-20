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
      <div className="pn-cab">
        <div>
          <h1 className="pn-h1">Membros</h1>
          <p className="pn-sub">Quem pode entrar no painel e com qual papel.</p>
        </div>
      </div>

      <form onSubmit={aoAdicionar} className="pn-cartao pn-novo-membro">
        <div className="pn-campo">
          <label htmlFor="novo-email">E-mail</label>
          <input
            id="novo-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pn-input"
          />
        </div>
        <div className="pn-campo">
          <label htmlFor="novo-papel">Papel</label>
          <select
            id="novo-papel"
            value={papel}
            onChange={(e) => setPapel(e.target.value as Papel)}
            className="pn-input"
          >
            <option value="membro">Membro</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={ocupado} className="pn-btn">
          Adicionar
        </button>
      </form>

      {erro && (
        <p role="alert" className="pn-alerta">
          {erro}
        </p>
      )}

      <div>
        {membros === null ? (
          <p role="status" className="pn-mudo">Carregando…</p>
        ) : membros.length === 0 ? (
          <p className="pn-mudo">Nenhum membro cadastrado.</p>
        ) : (
          <div className="pn-cartao pn-tab">
            <div className="pn-lin pn-lin-m pn-lin-cab" aria-hidden="true">
              <span>E-mail</span>
              <span>Papel</span>
              <span>Estado</span>
              <span />
            </div>
            <ul className="pn-linhas">
              {membros.map((m, i) => {
                const proprio = m.email.toLowerCase() === meu;
                const bloqueado = proprio && m.ativo;
                return (
                  <li key={m.id} className="pn-lin pn-lin-m">
                    <span className="pn-resp">
                      <span className={`pn-av pn-av-p${i % 2 ? " pn-av-g" : ""}`} aria-hidden="true">
                        {m.email.charAt(0).toUpperCase()}
                      </span>
                      <span className="pn-resp-t">{m.email}</span>
                    </span>
                    <span className="pn-lin-tipo">{m.papel === "admin" ? "Admin" : "Membro"}</span>
                    <span className={`pn-lin-st pn-st${m.ativo ? " pn-st-o" : ""}`}>{m.ativo ? "Ativo" : "Inativo"}</span>
                    <div className="pn-lin-acoes">
                      <button
                        type="button"
                        className="pn-ed"
                        disabled={ocupado || bloqueado}
                        aria-describedby={bloqueado ? `aviso-${m.id}` : undefined}
                        onClick={() => void executar(() => definirAtivo(m.id, !m.ativo))}
                      >
                        {m.ativo ? "Desativar" : "Ativar"}
                      </button>
                    </div>
                    {bloqueado && (
                      <p id={`aviso-${m.id}`} className="pn-lin-aviso">
                        Você não pode desativar a si mesmo.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
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
