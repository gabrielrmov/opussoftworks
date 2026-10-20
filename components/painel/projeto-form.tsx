"use client";

import { useState, type FormEvent } from "react";
import { mensagemDeErro } from "@/lib/painel/erros";
import {
  STATUS,
  TIPOS,
  validarProjeto,
  type DadosProjeto,
  type MembroEquipe,
  type Projeto,
  type StatusProjeto,
  type TipoProjeto,
} from "@/lib/painel/projetos";

type Props = {
  inicial?: Projeto;
  equipe: MembroEquipe[];
  salvando: boolean;
  onSalvar: (dados: DadosProjeto) => void;
  onCancelar: () => void;
  erro?: string;
};

export function ProjetoForm({ inicial, equipe, salvando, onSalvar, onCancelar, erro }: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [cliente, setCliente] = useState(inicial?.cliente ?? "");
  const [tipo, setTipo] = useState<TipoProjeto>(inicial?.tipo ?? TIPOS[0].valor);
  const [status, setStatus] = useState<StatusProjeto>(inicial?.status ?? "planejado");
  const [prazo, setPrazo] = useState(inicial?.prazo ?? "");
  const [responsavel, setResponsavel] = useState(inicial?.responsavel_id ?? "");
  const [observacoes, setObservacoes] = useState(inicial?.observacoes ?? "");
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  const foraDaEquipe = responsavel !== "" && !equipe.some((m) => m.id === responsavel);

  function aoEnviar(ev: FormEvent) {
    ev.preventDefault();
    if (salvando) return;
    const dados: DadosProjeto = {
      nome,
      cliente,
      tipo,
      status,
      prazo: prazo || null,
      responsavel_id: responsavel || null,
      observacoes: observacoes || null,
    };
    try {
      validarProjeto(dados);
    } catch (e) {
      setErroLocal(mensagemDeErro(e));
      return;
    }
    setErroLocal(null);
    onSalvar(dados);
  }

  const mensagem = erroLocal ?? erro;

  return (
    <form aria-label="Projeto" onSubmit={aoEnviar} className="pn-gav-form">
      <div className="pn-gav-campos">
        <div className="pn-campo">
          <label htmlFor="proj-nome">Nome</label>
          <input id="proj-nome" maxLength={120} value={nome} onChange={(e) => setNome(e.target.value)} className="pn-input" />
        </div>
        <div className="pn-campo">
          <label htmlFor="proj-cliente">Cliente</label>
          <input id="proj-cliente" maxLength={120} value={cliente} onChange={(e) => setCliente(e.target.value)} className="pn-input" />
        </div>
        <div className="pn-dois">
          <div className="pn-campo">
            <label htmlFor="proj-tipo">Tipo</label>
            <select id="proj-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoProjeto)} className="pn-input">
              {TIPOS.map((t) => (
                <option key={t.valor} value={t.valor}>{t.rotulo}</option>
              ))}
            </select>
          </div>
          <div className="pn-campo">
            <label htmlFor="proj-status">Status</label>
            <select id="proj-status" value={status} onChange={(e) => setStatus(e.target.value as StatusProjeto)} className="pn-input">
              {STATUS.map((s) => (
                <option key={s.valor} value={s.valor}>{s.rotulo}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pn-dois">
          <div className="pn-campo">
            <label htmlFor="proj-prazo">Prazo</label>
            <input id="proj-prazo" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="pn-input" />
          </div>
          <div className="pn-campo">
            <label htmlFor="proj-responsavel">Responsável</label>
            <select id="proj-responsavel" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="pn-input">
              <option value="">Sem responsável</option>
              {foraDaEquipe && <option value={responsavel}>Responsável atual (fora da equipe ativa)</option>}
              {equipe.map((m) => (
                <option key={m.id} value={m.id}>{m.email}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pn-campo">
          <label htmlFor="proj-obs">Observações</label>
          <textarea
            id="proj-obs"
            rows={4}
            maxLength={2000}
            placeholder="Algo que a equipe precisa saber"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="pn-input"
          />
        </div>
        {mensagem && (
          <p role="alert" className="pn-form-erro">
            {mensagem}
          </p>
        )}
      </div>

      <footer className="pn-gav-rod">
        <button type="button" disabled={salvando} onClick={onCancelar} className="pn-btn pn-btn-sec">
          Cancelar
        </button>
        <button type="submit" disabled={salvando} className="pn-btn">
          Salvar
        </button>
      </footer>
    </form>
  );
}
