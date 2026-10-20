"use client";

import { NovoProjetoLink } from "@/components/painel/novo-projeto-link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Casca } from "@/components/painel/casca";
import { Guarda } from "@/components/painel/guarda";
import { VisaoGeralView } from "@/components/painel/visao-geral-view";
import { mensagemDeErro } from "@/lib/painel/erros";
import {
  hojeEmSaoPaulo,
  listarEquipe,
  listarProjetos,
  type MembroEquipe,
  type Projeto,
} from "@/lib/painel/projetos";
import { resumirProjetos, saudacao } from "@/lib/painel/resumo";
import { useAcesso } from "@/lib/painel/use-acesso";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function dataPorExtenso(hoje: string): string {
  const [ano, mes, dia] = hoje.split("-").map(Number);
  const semana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
  return `${DIAS[semana]}, ${dia} de ${MESES[mes - 1]}`;
}

function horaEmSaoPaulo(agora: Date): number {
  const partes = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).formatToParts(agora);
  const hora = Number(partes.find((p) => p.type === "hour")?.value);
  if (!Number.isFinite(hora)) return agora.getHours();
  return hora === 24 ? 0 : hora;
}

type Estado =
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "ok"; projetos: Projeto[]; equipe: MembroEquipe[]; erroEquipe: boolean; agora: Date };

function Conteudo() {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const requisicao = useRef(0);

  const carregar = useCallback(async () => {
    const minha = ++requisicao.current;
    const [projetos, equipe] = await Promise.allSettled([listarProjetos(), listarEquipe()]);
    if (minha !== requisicao.current) return;
    if (projetos.status === "rejected") {
      setEstado({ tipo: "erro", mensagem: mensagemDeErro(projetos.reason) });
      return;
    }
    setEstado({
      tipo: "ok",
      projetos: projetos.value,
      equipe: equipe.status === "fulfilled" ? equipe.value : [],
      erroEquipe: equipe.status === "rejected",
      agora: new Date(),
    });
  }, []);

  useEffect(() => {
    void carregar();
    return () => {
      requisicao.current += 1; // invalida respostas pendentes após desmontar
    };
  }, [carregar]);

  if (estado.tipo === "carregando") {
    return (
      <p role="status" className="pn-mudo">
        Carregando…
      </p>
    );
  }
  if (estado.tipo === "erro") {
    return (
      <div role="alert" className="pn-erro">
        <p>{estado.mensagem}</p>
        <button type="button" className="pn-btn pn-btn-sec" onClick={() => void carregar()}>
          Tentar novamente
        </button>
      </div>
    );
  }
  const hoje = hojeEmSaoPaulo(estado.agora);
  return (
    <VisaoGeralView
      resumo={resumirProjetos(estado.projetos, estado.equipe, hoje)}
      saudacao={saudacao(horaEmSaoPaulo(estado.agora))}
      dataTexto={dataPorExtenso(hoje)}
      avisoEquipe={estado.erroEquipe ? "Não foi possível carregar a equipe." : undefined}
    />
  );
}

function VisaoGeral() {
  // Só renderiza dentro de <Guarda>, então o estado é "ok"; o resto é defensivo.
  const acesso = useAcesso();
  if (acesso.estado !== "ok" || !acesso.papel) return null;

  return (
    <Casca
      papel={acesso.papel}
      email={acesso.email}
      acaoTopo={
        <NovoProjetoLink className="pn-btn">
          Novo projeto
        </NovoProjetoLink>
      }
    >
      <Conteudo />
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
