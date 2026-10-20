"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Casca } from "@/components/painel/casca";
import { useAcesso } from "@/lib/painel/use-acesso";
import { Guarda } from "@/components/painel/guarda";
import { ProjetoForm } from "@/components/painel/projeto-form";
import { mensagemDeErro } from "@/lib/painel/erros";
import {
  STATUS,
  TIPOS,
  apagarProjeto,
  atualizarProjeto,
  criarProjeto,
  estaAtrasado,
  hojeEmSaoPaulo,
  listarEquipe,
  listarProjetos,
  type DadosProjeto,
  type MembroEquipe,
  type Projeto,
} from "@/lib/painel/projetos";

const botao = "rounded-md border border-[#161616]/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50";

function formatarPrazo(prazo: string | null): string {
  if (!prazo) return "Sem prazo";
  const [a, m, d] = prazo.split("-");
  return `${d}/${m}/${a}`;
}

function Gestao({ admin }: { admin: boolean }) {
  const [projetos, setProjetos] = useState<Projeto[] | null>(null);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [erroEquipe, setErroEquipe] = useState(false);
  const [equipeCarregada, setEquipeCarregada] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [falhouCarga, setFalhouCarga] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState<{ projeto?: Projeto } | null>(null);
  const [erroForm, setErroForm] = useState<string | undefined>();
  const [salvando, setSalvando] = useState(false);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const requisicao = useRef(0);
  const emVoo = useRef(false);

  const carregar = useCallback(async () => {
    const minha = ++requisicao.current;
    try {
      const lista = await listarProjetos();
      if (minha !== requisicao.current) return;
      setProjetos(lista);
      setFalhouCarga(false);
      setErro(null);
    } catch (e) {
      if (minha !== requisicao.current) return;
      setErro(mensagemDeErro(e));
      setFalhouCarga(true);
    }
  }, []);

  useEffect(() => {
    void carregar();
    let ativo = true;
    listarEquipe().then(
      (e) => {
        if (!ativo) return;
        setEquipe(e);
        setEquipeCarregada(true);
      },
      () => ativo && setErroEquipe(true),
    );
    return () => {
      ativo = false;
    };
  }, [carregar]);

  async function executar(acao: () => Promise<void>, aoFalhar: (msg: string) => void): Promise<boolean> {
    if (emVoo.current) return false;
    emVoo.current = true;
    setSalvando(true);
    try {
      await acao();
    } catch (e) {
      aoFalhar(mensagemDeErro(e));
      return false;
    } finally {
      emVoo.current = false;
      setSalvando(false);
    }
    setErro(null);
    await carregar();
    return true;
  }

  async function aoSalvar(dados: DadosProjeto) {
    const editando = form?.projeto;
    setErroForm(undefined);
    const ok = await executar(
      () => (editando ? atualizarProjeto(editando.id, dados) : criarProjeto(dados)),
      setErroForm,
    );
    if (ok) setForm(null);
  }

  async function aoApagar(id: string) {
    const ok = await executar(() => apagarProjeto(id), setErro);
    if (ok) setConfirmando(null);
  }

  const hoje = hojeEmSaoPaulo();
  const visiveis = (projetos ?? []).filter((p) => !filtro || p.status === filtro);
  const emailDe = (id: string | null) => {
    if (!id) return "—";
    if (erroEquipe) return "Indisponível";
    if (!equipeCarregada) return "…";
    return equipe.find((m) => m.id === id)?.email ?? "Fora da equipe ativa";
  };
  const rotulo = <T extends { valor: string; rotulo: string }>(lista: T[], v: string) =>
    lista.find((i) => i.valor === v)?.rotulo ?? v;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Projetos</h1>
        <button
          type="button"
          disabled={salvando}
          onClick={() => {
            setErroForm(undefined);
            setForm({});
          }}
          className="rounded-md bg-[#FF6039] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Novo projeto
        </button>
      </div>

      {form && (
        <ProjetoForm
          key={form.projeto?.id ?? "novo"}
          inicial={form.projeto}
          equipe={equipe}
          salvando={salvando}
          erro={erroForm}
          onSalvar={(d) => void aoSalvar(d)}
          onCancelar={() => setForm(null)}
        />
      )}

      {erro && (
        <p role="alert" className="mt-4 text-sm font-medium text-[#B3261E]">
          {erro}
        </p>
      )}

      <div className="mt-6 flex items-center gap-2">
        <label htmlFor="filtro-status" className="text-sm font-medium">Filtrar por status</label>
        <select
          id="filtro-status"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="rounded-md border border-[#161616]/20 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          {STATUS.map((s) => (
            <option key={s.valor} value={s.valor}>{s.rotulo}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        {projetos === null && falhouCarga ? (
          <button
            type="button"
            onClick={() => {
              setFalhouCarga(false);
              setErro(null);
              void carregar();
            }}
            className={botao}
          >
            Tentar novamente
          </button>
        ) : projetos === null ? (
          <p role="status" className="text-sm text-[#161616]/60">Carregando…</p>
        ) : projetos.length === 0 ? (
          <p className="text-sm text-[#161616]/60">Nenhum projeto ainda.</p>
        ) : visiveis.length === 0 ? (
          <p className="text-sm text-[#161616]/60">Nenhum projeto com esse status.</p>
        ) : (
          <ul className="grid gap-3">
            {visiveis.map((p) => (
              <li
                key={p.id}
                className="grid gap-x-6 gap-y-1 rounded-md border border-[#161616]/10 bg-white px-4 py-3 text-sm md:grid-cols-[2fr_1.5fr_1fr_1.2fr_1.2fr_1.5fr_auto] md:items-center"
              >
                <h2 className="font-semibold">{p.nome}</h2>
                <span>{p.cliente}</span>
                <span className="text-[#161616]/70">{rotulo(TIPOS, p.tipo)}</span>
                <span className="text-[#161616]/70">{rotulo(STATUS, p.status)}</span>
                <span>
                  {formatarPrazo(p.prazo)}
                  {estaAtrasado(p, hoje) && (
                    <span className="ml-2 font-medium text-[#B3261E]">atrasado</span>
                  )}
                </span>
                <span className="break-all text-[#161616]/70">{emailDe(p.responsavel_id)}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={salvando}
                    onClick={() => {
                      setErroForm(undefined);
                      setForm({ projeto: p });
                    }}
                    className={botao}
                  >
                    Editar
                  </button>
                  {admin &&
                    (confirmando === p.id ? (
                      <>
                        <button
                          type="button"
                          disabled={salvando}
                          onClick={() => void aoApagar(p.id)}
                          className={`${botao} text-[#B3261E]`}
                        >
                          Confirmar exclusão
                        </button>
                        <button type="button" disabled={salvando} onClick={() => setConfirmando(null)} className={botao}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="button" disabled={salvando} onClick={() => setConfirmando(p.id)} className={botao}>
                        Apagar
                      </button>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section aria-labelledby="equipe-titulo" className="mt-8">
        <h2 id="equipe-titulo" className="text-lg font-semibold">Equipe</h2>
        {erroEquipe ? (
          <p className="mt-2 text-sm text-[#161616]/60">Não foi possível carregar a equipe.</p>
        ) : (
          <ul className="mt-2 text-sm">
            {equipe.map((m) => (
              <li key={m.id} className="flex gap-3 py-1">
                <span className="break-all">{m.email}</span>
                <span className="text-[#161616]/60">{m.papel === "admin" ? "Admin" : "Membro"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Conteudo() {
  const acesso = useAcesso();
  if (acesso.estado !== "ok" || !acesso.papel) return null;
  return (
    <Casca papel={acesso.papel} email={acesso.email}>
      <Gestao admin={acesso.papel === "admin"} />
    </Casca>
  );
}

export default function ProjetosPage() {
  return (
    <Guarda>
      <Conteudo />
    </Guarda>
  );
}
