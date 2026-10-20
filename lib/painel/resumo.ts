import type { MembroEquipe, Projeto, StatusProjeto } from "@/lib/painel/projetos";

export type ResumoPainel = {
  total: number;
  emAndamento: number;
  emRevisao: number;
  porStatus: Record<StatusProjeto, number>;
  atrasados: Array<Projeto & { diasDeAtraso: number }>;
  entregasEm7Dias: number;
  proximaEntrega: Projeto | null;
  proximosPrazos: Array<{ projeto: Projeto; quando: string; atrasado: boolean }>;
  entregasPorSemana: Array<{ inicio: string; rotulo: string; total: number; atual: boolean }>;
  cargaPorPessoa: Array<{
    id: string | null;
    nome: string;
    emAndamento: number;
    emRevisao: number;
    outros: number;
    total: number;
  }>;
  agendaSemana: Array<{ data: string; diaSemana: string; hoje: boolean; projetos: Projeto[] }>;
};

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MS_DIA = 86_400_000;

function paraUtc(data: string): number {
  const [ano, mes, dia] = data.split("-").map(Number);
  return Date.UTC(ano, mes - 1, dia);
}

function deUtc(ms: number): string {
  const d = new Date(ms);
  const ano = String(d.getUTCFullYear()).padStart(4, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dia = String(d.getUTCDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function dataValida(texto: string | null): texto is string {
  if (texto === null) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) return false;
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
}

export function somarDias(data: string, n: number): string {
  return deUtc(paraUtc(data) + n * MS_DIA);
}

export function diasEntre(a: string, b: string): number {
  return Math.round((paraUtc(b) - paraUtc(a)) / MS_DIA);
}

export function segundaDaSemana(data: string): string {
  const dow = new Date(paraUtc(data)).getUTCDay(); // 0 = domingo
  return somarDias(data, -((dow + 6) % 7));
}

export function textoRelativo(prazo: string, hoje: string): string {
  const dias = diasEntre(hoje, prazo);
  if (dias < 0) return dias === -1 ? "1 dia atrasado" : `${-dias} dias atrasado`;
  if (dias === 0) return "hoje";
  if (dias === 1) return "amanhã";
  return `em ${dias} dias`;
}

export function saudacao(hora: number): "Bom dia" | "Boa tarde" | "Boa noite" {
  if (hora >= 5 && hora <= 11) return "Bom dia";
  if (hora >= 12 && hora <= 17) return "Boa tarde";
  return "Boa noite";
}

function rotuloDia(data: string): string {
  const [, mes, dia] = data.split("-").map(Number);
  return `${dia} ${MESES[mes - 1]}`;
}

function nomeDoEmail(email: string): string {
  const parte = email.split("@")[0] ?? "";
  return parte.charAt(0).toUpperCase() + parte.slice(1);
}

function porNome(a: Projeto, b: Projeto): number {
  return a.nome.localeCompare(b.nome);
}

export function resumirProjetos(projetos: Projeto[], equipe: MembroEquipe[], hoje: string): ResumoPainel {
  const porStatus: Record<StatusProjeto, number> = {
    planejado: 0,
    em_andamento: 0,
    em_revisao: 0,
    pausado: 0,
    concluido: 0,
  };
  for (const p of projetos) porStatus[p.status] += 1;

  const abertos = projetos.filter((p) => p.status !== "concluido");
  const comPrazo = abertos.filter((p): p is Projeto & { prazo: string } => dataValida(p.prazo));

  const atrasados = comPrazo
    .filter((p) => p.prazo < hoje)
    .sort((a, b) => a.prazo.localeCompare(b.prazo) || porNome(a, b))
    .map((p) => ({ ...p, diasDeAtraso: diasEntre(p.prazo, hoje) }));

  const limite7 = somarDias(hoje, 6);
  const entregasEm7Dias = comPrazo.filter((p) => p.prazo >= hoje && p.prazo <= limite7).length;

  const futuros = comPrazo
    .filter((p) => p.prazo >= hoje)
    .sort((a, b) => a.prazo.localeCompare(b.prazo) || porNome(a, b));
  const proximaEntrega: Projeto | null = futuros[0] ?? null;

  const proximosPrazos = [...atrasados, ...futuros]
    .slice(0, 5)
    .map((p) => ({ projeto: p as Projeto, quando: textoRelativo(p.prazo as string, hoje), atrasado: (p.prazo as string) < hoje }));

  const segunda = segundaDaSemana(hoje);
  const entregasPorSemana = Array.from({ length: 6 }, (_, i) => {
    const inicio = somarDias(segunda, i * 7);
    const fim = somarDias(inicio, 6);
    return {
      inicio,
      rotulo: rotuloDia(inicio),
      total: comPrazo.filter((p) => p.prazo >= inicio && p.prazo <= fim).length,
      atual: i === 0,
    };
  });

  type Linha = ResumoPainel["cargaPorPessoa"][number];
  const nova = (id: string | null, nome: string): Linha => ({
    id,
    nome,
    emAndamento: 0,
    emRevisao: 0,
    outros: 0,
    total: 0,
  });
  const linhas = new Map<string, Linha>(equipe.map((m) => [m.id, nova(m.id, nomeDoEmail(m.email))]));
  const semResponsavel = nova(null, "Sem responsável");
  for (const p of abertos) {
    const linha = (p.responsavel_id !== null && linhas.get(p.responsavel_id)) || semResponsavel;
    if (p.status === "em_andamento") linha.emAndamento += 1;
    else if (p.status === "em_revisao") linha.emRevisao += 1;
    else linha.outros += 1;
    linha.total += 1;
  }
  const cargaPorPessoa = Array.from(linhas.values()).sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
  if (semResponsavel.total > 0) cargaPorPessoa.push(semResponsavel);

  const agendaSemana = DIAS_SEMANA.map((diaSemana, i) => {
    const data = somarDias(segunda, i);
    return {
      data,
      diaSemana,
      hoje: data === hoje,
      projetos: comPrazo.filter((p) => p.prazo === data).sort(porNome) as Projeto[],
    };
  });

  return {
    total: projetos.length,
    emAndamento: porStatus.em_andamento,
    emRevisao: porStatus.em_revisao,
    porStatus,
    atrasados,
    entregasEm7Dias,
    proximaEntrega,
    proximosPrazos,
    entregasPorSemana,
    cargaPorPessoa,
    agendaSemana,
  };
}
