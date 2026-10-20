import { ErroDeValidacao, exigirCliente } from "@/lib/painel/erros";

export type TipoProjeto = "site" | "sistema" | "trafego" | "outro";
export type StatusProjeto = "planejado" | "em_andamento" | "em_revisao" | "pausado" | "concluido";

export type Projeto = {
  id: string;
  nome: string;
  cliente: string;
  tipo: TipoProjeto;
  status: StatusProjeto;
  prazo: string | null;
  responsavel_id: string | null;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type DadosProjeto = {
  nome: string;
  cliente: string;
  tipo: TipoProjeto;
  status: StatusProjeto;
  prazo?: string | null;
  responsavel_id?: string | null;
  observacoes?: string | null;
};

export type MembroEquipe = { id: string; email: string; papel: "admin" | "membro" };

export const TIPOS: { valor: TipoProjeto; rotulo: string }[] = [
  { valor: "site", rotulo: "Site" },
  { valor: "sistema", rotulo: "Sistema" },
  { valor: "trafego", rotulo: "Tráfego" },
  { valor: "outro", rotulo: "Outro" },
];

export const STATUS: { valor: StatusProjeto; rotulo: string }[] = [
  { valor: "planejado", rotulo: "Planejado" },
  { valor: "em_andamento", rotulo: "Em andamento" },
  { valor: "em_revisao", rotulo: "Em revisão" },
  { valor: "pausado", rotulo: "Pausado" },
  { valor: "concluido", rotulo: "Concluído" },
];

function dataValida(texto: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) return false;
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
}

// Pura: sem I/O. Usa trim() do JS (inclui tabs/quebras de linha, que o btrim do banco não remove).
export function validarProjeto(dados: DadosProjeto): DadosProjeto {
  const nome = (dados.nome ?? "").trim();
  if (nome.length === 0) throw new ErroDeValidacao("Informe o nome do projeto.");
  if (nome.length > 120) throw new ErroDeValidacao("O nome pode ter no máximo 120 caracteres.");

  const cliente = (dados.cliente ?? "").trim();
  if (cliente.length === 0) throw new ErroDeValidacao("Informe o cliente.");
  if (cliente.length > 120) throw new ErroDeValidacao("O cliente pode ter no máximo 120 caracteres.");

  if (!TIPOS.some((t) => t.valor === dados.tipo)) throw new ErroDeValidacao("Escolha um tipo válido.");
  if (!STATUS.some((s) => s.valor === dados.status)) throw new ErroDeValidacao("Escolha um status válido.");

  const prazoBruto = (dados.prazo ?? "").trim();
  if (prazoBruto && !dataValida(prazoBruto)) throw new ErroDeValidacao("Informe um prazo válido.");

  const observacoes = (dados.observacoes ?? "").trim();
  if (observacoes.length > 2000) {
    throw new ErroDeValidacao("As observações podem ter no máximo 2000 caracteres.");
  }

  return {
    nome,
    cliente,
    tipo: dados.tipo,
    status: dados.status,
    prazo: prazoBruto || null,
    responsavel_id: (dados.responsavel_id ?? "").trim() || null,
    observacoes: observacoes || null,
  };
}

export function hojeEmSaoPaulo(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(agora);
}

export function estaAtrasado(p: Pick<Projeto, "prazo" | "status">, hoje: string): boolean {
  return p.status !== "concluido" && p.prazo !== null && p.prazo < hoje;
}

// RLS filtrando a linha (ou id inexistente) devolve sucesso com 0 linhas.
function exigirLinhaAfetada(data: unknown[] | null) {
  if (!data || data.length === 0) throw { code: "42501", message: "nenhuma linha afetada" };
}

export async function listarProjetos(): Promise<Projeto[]> {
  const { data, error } = await exigirCliente()
    .from("projetos")
    .select("*")
    .order("prazo", { ascending: true, nullsFirst: false })
    .order("nome");
  if (error) throw error;
  return (data ?? []) as Projeto[];
}

export async function criarProjeto(dados: DadosProjeto): Promise<void> {
  const limpo = validarProjeto(dados);
  const { error } = await exigirCliente().from("projetos").insert(limpo);
  if (error) throw error;
}

export async function atualizarProjeto(id: string, dados: DadosProjeto): Promise<void> {
  const limpo = validarProjeto(dados);
  const { data, error } = await exigirCliente().from("projetos").update(limpo).eq("id", id).select("id");
  if (error) throw error;
  exigirLinhaAfetada(data);
}

export async function apagarProjeto(id: string): Promise<void> {
  const { data, error } = await exigirCliente().from("projetos").delete().eq("id", id).select("id");
  if (error) throw error;
  exigirLinhaAfetada(data);
}

export async function listarEquipe(): Promise<MembroEquipe[]> {
  const { data, error } = await exigirCliente().rpc("equipe");
  if (error) throw error;
  return (data ?? []) as MembroEquipe[];
}

export async function contarEmAndamento(): Promise<number> {
  const { count, error } = await exigirCliente()
    .from("projetos")
    .select("id", { count: "exact", head: true })
    .eq("status", "em_andamento");
  if (error) throw error;
  return count ?? 0;
}
