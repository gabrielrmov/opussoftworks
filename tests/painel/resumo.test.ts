import { describe, expect, it } from "vitest";
import type { MembroEquipe, Projeto } from "@/lib/painel/projetos";
import {
  diasEntre,
  resumirProjetos,
  saudacao,
  segundaDaSemana,
  somarDias,
  textoRelativo,
} from "@/lib/painel/resumo";

// 2026-10-20 é uma terça-feira; a segunda da semana é 2026-10-19.
const HOJE = "2026-10-20";

let seq = 0;
function projeto(parcial: Partial<Projeto> = {}): Projeto {
  seq += 1;
  return {
    id: `p${seq}`,
    nome: `Projeto ${String(seq).padStart(2, "0")}`,
    cliente: "Cliente Teste",
    tipo: "site",
    status: "em_andamento",
    prazo: null,
    responsavel_id: null,
    observacoes: null,
    criado_em: "2026-01-01T00:00:00Z",
    atualizado_em: "2026-01-01T00:00:00Z",
    ...parcial,
  };
}

const ana: MembroEquipe = { id: "u1", email: "ana@exemplo.test", papel: "admin" };
const bruno: MembroEquipe = { id: "u2", email: "bruno@exemplo.test", papel: "membro" };

describe("somarDias", () => {
  it("cruza mês", () => {
    expect(somarDias("2026-10-30", 3)).toBe("2026-11-02");
    expect(somarDias("2026-11-02", -3)).toBe("2026-10-30");
  });
  it("cruza ano (31 dez + 1)", () => {
    expect(somarDias("2026-12-31", 1)).toBe("2027-01-01");
    expect(somarDias("2027-01-01", -1)).toBe("2026-12-31");
  });
  it("ano bissexto 28 fev 2028 + 1 = 29 fev", () => {
    expect(somarDias("2028-02-28", 1)).toBe("2028-02-29");
    expect(somarDias("2028-02-29", 1)).toBe("2028-03-01");
    expect(somarDias("2027-02-28", 1)).toBe("2027-03-01");
  });
});

describe("segundaDaSemana", () => {
  it("domingo vai para a segunda anterior", () => {
    expect(segundaDaSemana("2026-10-25")).toBe("2026-10-19");
  });
  it("segunda é ela mesma", () => {
    expect(segundaDaSemana("2026-10-19")).toBe("2026-10-19");
  });
  it("quarta vai para a segunda da semana", () => {
    expect(segundaDaSemana("2026-10-21")).toBe("2026-10-19");
  });
});

describe("diasEntre", () => {
  it("diferença em dias inteiros, negativa se b < a", () => {
    expect(diasEntre("2026-10-20", "2026-10-27")).toBe(7);
    expect(diasEntre("2026-10-20", "2026-10-20")).toBe(0);
    expect(diasEntre("2026-10-20", "2026-10-17")).toBe(-3);
    expect(diasEntre("2026-12-30", "2027-01-02")).toBe(3);
  });
});

describe("textoRelativo", () => {
  it("formas relativas", () => {
    expect(textoRelativo("2026-10-20", HOJE)).toBe("hoje");
    expect(textoRelativo("2026-10-21", HOJE)).toBe("amanhã");
    expect(textoRelativo("2026-10-25", HOJE)).toBe("em 5 dias");
    expect(textoRelativo("2026-10-17", HOJE)).toBe("3 dias atrasado");
  });
  it("singular e plural", () => {
    expect(textoRelativo("2026-10-19", HOJE)).toBe("1 dia atrasado");
    expect(textoRelativo("2026-10-22", HOJE)).toBe("em 2 dias");
  });
});

describe("saudacao", () => {
  it("por faixa de hora", () => {
    expect(saudacao(4)).toBe("Boa noite");
    expect(saudacao(5)).toBe("Bom dia");
    expect(saudacao(11)).toBe("Bom dia");
    expect(saudacao(12)).toBe("Boa tarde");
    expect(saudacao(17)).toBe("Boa tarde");
    expect(saudacao(18)).toBe("Boa noite");
  });
});

describe("resumirProjetos", () => {
  it("lista vazia devolve zeros e listas vazias, sem NaN", () => {
    const r = resumirProjetos([], [], HOJE);
    expect(r.total).toBe(0);
    expect(r.emAndamento).toBe(0);
    expect(r.emRevisao).toBe(0);
    expect(r.atrasados).toEqual([]);
    expect(r.entregasEm7Dias).toBe(0);
    expect(r.proximaEntrega).toBeNull();
    expect(r.proximosPrazos).toEqual([]);
    expect(r.entregasPorSemana).toHaveLength(6);
    expect(r.entregasPorSemana.every((s) => s.total === 0)).toBe(true);
    expect(r.cargaPorPessoa).toEqual([]);
    expect(r.agendaSemana).toHaveLength(7);
    expect(r.agendaSemana.every((d) => d.projetos.length === 0)).toBe(true);
    expect(Object.values(r.porStatus).every((n) => n === 0)).toBe(true);
    expect(JSON.stringify(r)).not.toContain("NaN");
  });

  it("concluídos nunca entram em atrasados, entregas, carga ou agenda", () => {
    const c1 = projeto({ status: "concluido", prazo: "2026-10-10", responsavel_id: ana.id });
    const c2 = projeto({ status: "concluido", prazo: "2026-10-22", responsavel_id: ana.id });
    const r = resumirProjetos([c1, c2], [ana], HOJE);
    expect(r.total).toBe(2);
    expect(r.porStatus.concluido).toBe(2);
    expect(r.atrasados).toEqual([]);
    expect(r.entregasEm7Dias).toBe(0);
    expect(r.proximaEntrega).toBeNull();
    expect(r.proximosPrazos).toEqual([]);
    expect(r.entregasPorSemana.every((s) => s.total === 0)).toBe(true);
    expect(r.cargaPorPessoa).toEqual([
      { id: ana.id, nome: "Ana", emAndamento: 0, emRevisao: 0, outros: 0, total: 0 },
    ]);
    expect(r.agendaSemana.every((d) => d.projetos.length === 0)).toBe(true);
  });

  it("prazo igual a hoje não é atrasado e entra em entregasEm7Dias", () => {
    const p = projeto({ prazo: HOJE });
    const r = resumirProjetos([p], [], HOJE);
    expect(r.atrasados).toEqual([]);
    expect(r.entregasEm7Dias).toBe(1);
    expect(r.proximaEntrega?.id).toBe(p.id);
    expect(r.proximosPrazos[0]).toMatchObject({ quando: "hoje", atrasado: false });
  });

  it("prazo em hoje+6 entra e hoje+7 não", () => {
    const dentro = projeto({ prazo: "2026-10-26" });
    const fora = projeto({ prazo: "2026-10-27" });
    expect(resumirProjetos([dentro], [], HOJE).entregasEm7Dias).toBe(1);
    expect(resumirProjetos([fora], [], HOJE).entregasEm7Dias).toBe(0);
  });

  it("atrasados ordenados do mais vencido, com diasDeAtraso", () => {
    const a = projeto({ prazo: "2026-10-18" });
    const b = projeto({ prazo: "2026-10-10" });
    const c = projeto({ prazo: "2026-10-19" });
    const r = resumirProjetos([a, b, c], [], HOJE);
    expect(r.atrasados.map((p) => [p.id, p.diasDeAtraso])).toEqual([
      [b.id, 10],
      [a.id, 2],
      [c.id, 1],
    ]);
  });

  it("proximosPrazos: no máximo 5, vencidos primeiro", () => {
    const venc1 = projeto({ prazo: "2026-10-15" });
    const venc2 = projeto({ prazo: "2026-10-18" });
    const futuros = [
      projeto({ prazo: "2026-10-20" }),
      projeto({ prazo: "2026-10-21" }),
      projeto({ prazo: "2026-10-22" }),
      projeto({ prazo: "2026-10-23" }),
    ];
    const semPrazo = projeto({ prazo: null });
    const r = resumirProjetos([...futuros, semPrazo, venc2, venc1], [], HOJE);
    expect(r.proximosPrazos).toHaveLength(5);
    expect(r.proximosPrazos.map((x) => x.projeto.id)).toEqual([
      venc1.id,
      venc2.id,
      futuros[0].id,
      futuros[1].id,
      futuros[2].id,
    ]);
    expect(r.proximosPrazos.map((x) => x.atrasado)).toEqual([true, true, false, false, false]);
    expect(r.proximosPrazos[0].quando).toBe("5 dias atrasado");
  });

  it("entregasPorSemana: 6 semanas, semana atual marcada, domingo conta na semana que termina nele", () => {
    const domingo = projeto({ prazo: "2026-10-25" });
    const segundaSeguinte = projeto({ prazo: "2026-10-26" });
    const atrasadoAntigo = projeto({ prazo: "2026-10-05" });
    const longe = projeto({ prazo: "2026-12-31" });
    const r = resumirProjetos([domingo, segundaSeguinte, atrasadoAntigo, longe], [], HOJE);
    expect(r.entregasPorSemana).toHaveLength(6);
    expect(r.entregasPorSemana.map((s) => s.inicio)).toEqual([
      "2026-10-19",
      "2026-10-26",
      "2026-11-02",
      "2026-11-09",
      "2026-11-16",
      "2026-11-23",
    ]);
    expect(r.entregasPorSemana.map((s) => s.rotulo)).toEqual([
      "19 out",
      "26 out",
      "2 nov",
      "9 nov",
      "16 nov",
      "23 nov",
    ]);
    expect(r.entregasPorSemana.map((s) => s.total)).toEqual([1, 1, 0, 0, 0, 0]);
    expect(r.entregasPorSemana.map((s) => s.atual)).toEqual([true, false, false, false, false, false]);
  });

  it("virada de ano: semanas após 29 dez rotuladas corretamente", () => {
    const r = resumirProjetos([projeto({ prazo: "2027-01-05" })], [], "2026-12-29");
    expect(r.entregasPorSemana.map((s) => s.inicio)).toEqual([
      "2026-12-28",
      "2027-01-04",
      "2027-01-11",
      "2027-01-18",
      "2027-01-25",
      "2027-02-01",
    ]);
    expect(r.entregasPorSemana.map((s) => s.rotulo)).toEqual([
      "28 dez",
      "4 jan",
      "11 jan",
      "18 jan",
      "25 jan",
      "1 fev",
    ]);
    expect(r.entregasPorSemana[1].total).toBe(1);
  });

  it("cargaPorPessoa separa em andamento/revisão/outros e soma total", () => {
    const projetos = [
      projeto({ status: "em_andamento", responsavel_id: ana.id }),
      projeto({ status: "em_andamento", responsavel_id: ana.id }),
      projeto({ status: "em_revisao", responsavel_id: ana.id }),
      projeto({ status: "planejado", responsavel_id: ana.id }),
      projeto({ status: "pausado", responsavel_id: bruno.id }),
      projeto({ status: "concluido", responsavel_id: bruno.id }),
    ];
    const r = resumirProjetos(projetos, [bruno, ana], HOJE);
    expect(r.cargaPorPessoa).toEqual([
      { id: ana.id, nome: "Ana", emAndamento: 2, emRevisao: 1, outros: 1, total: 4 },
      { id: bruno.id, nome: "Bruno", emAndamento: 0, emRevisao: 0, outros: 1, total: 1 },
    ]);
    expect(r.emAndamento).toBe(2);
    expect(r.emRevisao).toBe(1);
  });

  it("responsável ausente da equipe vira 'Sem responsável'", () => {
    const projetos = [
      projeto({ responsavel_id: null }),
      projeto({ responsavel_id: "fantasma", status: "em_revisao" }),
      projeto({ responsavel_id: ana.id }),
      projeto({ responsavel_id: ana.id }),
      projeto({ responsavel_id: ana.id }),
    ];
    const r = resumirProjetos(projetos, [ana, bruno], HOJE);
    expect(r.cargaPorPessoa.map((l) => l.nome)).toEqual(["Ana", "Bruno", "Sem responsável"]);
    expect(r.cargaPorPessoa[2]).toEqual({
      id: null,
      nome: "Sem responsável",
      emAndamento: 1,
      emRevisao: 1,
      outros: 0,
      total: 2,
    });
    expect(resumirProjetos([projeto({ responsavel_id: ana.id })], [ana], HOJE).cargaPorPessoa).toHaveLength(1);
  });

  it("agendaSemana tem 7 dias de segunda a domingo e marca hoje", () => {
    const b = projeto({ nome: "B", prazo: "2026-10-22" });
    const a = projeto({ nome: "A", prazo: "2026-10-22" });
    const r = resumirProjetos([b, a, projeto({ prazo: "2026-10-26" })], [], HOJE);
    expect(r.agendaSemana.map((d) => d.data)).toEqual([
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
      "2026-10-23",
      "2026-10-24",
      "2026-10-25",
    ]);
    expect(r.agendaSemana.map((d) => d.diaSemana)).toEqual(["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]);
    expect(r.agendaSemana.map((d) => d.hoje)).toEqual([false, true, false, false, false, false, false]);
    expect(r.agendaSemana[3].projetos.map((p) => p.nome)).toEqual(["A", "B"]);
  });

  it("porStatus tem as 5 chaves mesmo com zero", () => {
    const r = resumirProjetos([projeto({ status: "pausado" })], [], HOJE);
    expect(r.porStatus).toEqual({ planejado: 0, em_andamento: 0, em_revisao: 0, pausado: 1, concluido: 0 });
  });

  it("prazo malformado é tratado como sem prazo, sem quebrar", () => {
    const r = resumirProjetos([projeto({ prazo: "2026-13-45" }), projeto({ prazo: "lixo" })], [], HOJE);
    expect(r.total).toBe(2);
    expect(r.atrasados).toEqual([]);
    expect(r.proximosPrazos).toEqual([]);
  });
});
