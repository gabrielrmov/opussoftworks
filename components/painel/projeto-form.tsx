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

const campo = "rounded-md border border-[#161616]/20 bg-white px-3 py-2 text-sm";

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
    <form
      aria-label="Projeto"
      onSubmit={aoEnviar}
      className="mt-6 grid gap-4 rounded-md border border-[#161616]/10 bg-white p-4 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="proj-nome" className="text-sm font-medium">Nome</label>
        <input id="proj-nome" maxLength={120} value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="proj-cliente" className="text-sm font-medium">Cliente</label>
        <input id="proj-cliente" maxLength={120} value={cliente} onChange={(e) => setCliente(e.target.value)} className={campo} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="proj-tipo" className="text-sm font-medium">Tipo</label>
        <select id="proj-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoProjeto)} className={campo}>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>{t.rotulo}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="proj-status" className="text-sm font-medium">Status</label>
        <select id="proj-status" value={status} onChange={(e) => setStatus(e.target.value as StatusProjeto)} className={campo}>
          {STATUS.map((s) => (
            <option key={s.valor} value={s.valor}>{s.rotulo}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="proj-prazo" className="text-sm font-medium">Prazo</label>
        <input id="proj-prazo" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className={campo} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="proj-responsavel" className="text-sm font-medium">Responsável</label>
        <select id="proj-responsavel" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className={campo}>
          <option value="">Sem responsável</option>
          {foraDaEquipe && <option value={responsavel}>Responsável atual (fora da equipe ativa)</option>}
          {equipe.map((m) => (
            <option key={m.id} value={m.id}>{m.email}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label htmlFor="proj-obs" className="text-sm font-medium">Observações</label>
        <textarea id="proj-obs" rows={3} maxLength={2000} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className={campo} />
      </div>

      {mensagem && (
        <p role="alert" className="text-sm font-medium text-[#B3261E] sm:col-span-2">
          {mensagem}
        </p>
      )}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-md bg-[#FF6039] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md border border-[#161616]/20 px-4 py-2 text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
