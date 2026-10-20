"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Casca } from "@/components/painel/casca";
import { Gaveta } from "@/components/painel/gaveta";
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
  type StatusProjeto,
} from "@/lib/painel/projetos";

const ORDEM_FILTRO: StatusProjeto[] = ["em_andamento", "em_revisao", "planejado", "pausado", "concluido"];

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function classeStatus(status: StatusProjeto): string {
  if (status === "em_andamento") return "pn-st pn-st-a";
  if (status === "em_revisao") return "pn-st pn-st-r";
  if (status === "concluido") return "pn-st pn-st-o";
  return "pn-st";
}

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
  const [filtro, setFiltro] = useState<StatusProjeto | "">("");
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState<{ projeto?: Projeto } | null>(null);
  const [erroForm, setErroForm] = useState<string | undefined>();
  const [salvando, setSalvando] = useState(false);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const requisicao = useRef(0);
  const emVoo = useRef(false);
  const novoRef = useRef<HTMLButtonElement>(null);

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

  // Lido no efeito (não no render) para não afetar o prerender estático.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("novo") === "1") setForm({});
  }, []);

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
  const termo = normalizar(busca);
  const visiveis = (projetos ?? []).filter(
    (p) =>
      (!filtro || p.status === filtro) &&
      (!termo || normalizar(p.nome).includes(termo) || normalizar(p.cliente).includes(termo)),
  );
  const vencidos = (projetos ?? []).filter((p) => estaAtrasado(p, hoje)).length;
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
      <div className="pn-cab">
        <div>
          <h1 className="pn-h1">Projetos</h1>
          {projetos && (
            <p className="pn-sub">
              {projetos.length} {projetos.length === 1 ? "projeto" : "projetos"} · {vencidos} com prazo vencido
            </p>
          )}
        </div>
        <button
          ref={novoRef}
          type="button"
          disabled={salvando}
          onClick={() => {
            setErroForm(undefined);
            setForm({});
          }}
          className="pn-btn"
        >
          Novo projeto
        </button>
      </div>

      <Gaveta
        aberta={form !== null}
        titulo={form?.projeto ? "Editar projeto" : "Novo projeto"}
        bloqueada={salvando}
        onFechar={() => setForm(null)}
        acionador={form?.projeto ? undefined : novoRef}
      >
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
      </Gaveta>

      {erro && (
        <p role="alert" className="pn-alerta">
          {erro}
        </p>
      )}

      <div className="pn-barra-filtros">
        <div role="group" aria-label="Filtrar por status" className="pn-seg">
          <button type="button" aria-pressed={filtro === ""} onClick={() => setFiltro("")}>
            Todos
          </button>
          {ORDEM_FILTRO.map((v) => (
            <button key={v} type="button" aria-pressed={filtro === v} onClick={() => setFiltro(v)}>
              {rotulo(STATUS, v)}
            </button>
          ))}
        </div>
        <div className="pn-busca">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            aria-label="Buscar por nome ou cliente"
            placeholder="Buscar por nome ou cliente"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="pn-tabela-area">
        {projetos === null && falhouCarga ? (
          <button
            type="button"
            onClick={() => {
              setFalhouCarga(false);
              setErro(null);
              void carregar();
            }}
            className="pn-btn pn-btn-sec"
          >
            Tentar novamente
          </button>
        ) : projetos === null ? (
          <p role="status" className="pn-mudo">Carregando…</p>
        ) : projetos.length === 0 ? (
          <p className="pn-mudo">Nenhum projeto ainda.</p>
        ) : visiveis.length === 0 ? (
          <p className="pn-mudo">{termo ? "Nenhum projeto encontrado." : "Nenhum projeto com esse status."}</p>
        ) : (
          <div className="pn-cartao pn-tab">
            <div className="pn-lin pn-lin-cab" aria-hidden="true">
              <span>Projeto</span>
              <span>Tipo</span>
              <span>Prazo</span>
              <span>Status</span>
              <span>Responsável</span>
              <span />
            </div>
            <ul className="pn-linhas">
              {visiveis.map((p) => {
                const email = emailDe(p.responsavel_id);
                const temEmail = p.responsavel_id !== null && email.includes("@");
                const atrasado = estaAtrasado(p, hoje);
                return (
                  <li key={p.id} className="pn-lin">
                    <div className="pn-lin-p">
                      <h2>{p.nome}</h2>
                      <small>{p.cliente}</small>
                    </div>
                    <span className="pn-lin-tipo">{rotulo(TIPOS, p.tipo)}</span>
                    <span className={`pn-num pn-lin-prazo${atrasado ? " pn-atr" : ""}`}>
                      {formatarPrazo(p.prazo)}
                      {atrasado && <span className="pn-atr-t">atrasado</span>}
                    </span>
                    <span className={`pn-lin-st ${classeStatus(p.status)}`}>{rotulo(STATUS, p.status)}</span>
                    <span className="pn-resp">
                      {temEmail && (
                        <span className="pn-av pn-av-p" aria-hidden="true">
                          {email.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="pn-resp-t">{email}</span>
                    </span>
                    <div className="pn-lin-acoes">
                      <button
                        type="button"
                        className="pn-ed"
                        disabled={salvando}
                        onClick={() => {
                          setErroForm(undefined);
                          setForm({ projeto: p });
                        }}
                      >
                        Editar
                      </button>
                      {admin &&
                        (confirmando === p.id ? (
                          <>
                            <button
                              type="button"
                              className="pn-ed pn-ed-perigo"
                              disabled={salvando}
                              onClick={() => void aoApagar(p.id)}
                            >
                              Confirmar exclusão
                            </button>
                            <button type="button" className="pn-ed" disabled={salvando} onClick={() => setConfirmando(null)}>
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button type="button" className="pn-ed" disabled={salvando} onClick={() => setConfirmando(p.id)}>
                            Apagar
                          </button>
                        ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <section aria-labelledby="equipe-titulo" className="pn-equipe">
        <h2 id="equipe-titulo" className="pn-tit">Equipe</h2>
        {erroEquipe ? (
          <p className="pn-mudo">Não foi possível carregar a equipe.</p>
        ) : (
          <ul className="pn-eq">
            {equipe.map((m, i) => (
              <li key={m.id} className="pn-pe">
                <span className={`pn-av${i % 2 ? " pn-av-g" : ""}`} aria-hidden="true">
                  {m.email.charAt(0).toUpperCase()}
                </span>
                <div>
                  <span className="pn-pe-email">{m.email}</span>
                  <small>{m.papel === "admin" ? "Admin" : "Membro"}</small>
                </div>
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
