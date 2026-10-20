import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabase } from "@/lib/supabase/client";
import { mensagemDeErro } from "@/lib/painel/erros";
import {
  STATUS,
  TIPOS,
  apagarProjeto,
  atualizarProjeto,
  contarEmAndamento,
  criarProjeto,
  estaAtrasado,
  hojeEmSaoPaulo,
  listarEquipe,
  listarProjetos,
  validarProjeto,
  type DadosProjeto,
} from "@/lib/painel/projetos";

vi.mock("@/lib/supabase/client");

const insert = vi.fn();
const selectAtualizar = vi.fn();
const eqAtualizar = vi.fn(() => ({ select: selectAtualizar }));
const update = vi.fn(() => ({ eq: eqAtualizar }));
const selectApagar = vi.fn();
const eqApagar = vi.fn(() => ({ select: selectApagar }));
const apagar = vi.fn(() => ({ eq: eqApagar }));
const order2 = vi.fn();
const order1 = vi.fn(() => ({ order: order2 }));
const eqContar = vi.fn();
const select = vi.fn((_colunas: string, opcoes?: unknown) => (opcoes ? { eq: eqContar } : { order: order1 }));
const from = vi.fn(() => ({ insert, update, delete: apagar, select }));
const rpc = vi.fn();

const valido: DadosProjeto = {
  nome: "Site Exemplo",
  cliente: "Cliente Teste",
  tipo: "site",
  status: "planejado",
};

beforeEach(() => {
  vi.clearAllMocks();
  insert.mockResolvedValue({ error: null });
  selectAtualizar.mockResolvedValue({ data: [{ id: "p-1" }], error: null });
  selectApagar.mockResolvedValue({ data: [{ id: "p-1" }], error: null });
  order2.mockResolvedValue({ data: [], error: null });
  eqContar.mockResolvedValue({ count: 3, error: null });
  rpc.mockResolvedValue({ data: [], error: null });
  vi.mocked(getSupabase).mockReturnValue({ from, rpc } as never);
});

describe("listas", () => {
  it("TIPOS e STATUS têm rótulos em português", () => {
    expect(TIPOS.map((t) => t.valor)).toEqual(["site", "sistema", "trafego", "outro"]);
    expect(TIPOS[2].rotulo).toBe("Tráfego");
    expect(STATUS.map((s) => s.valor)).toEqual(["planejado", "em_andamento", "em_revisao", "pausado", "concluido"]);
    expect(STATUS[1].rotulo).toBe("Em andamento");
  });
});

describe("validarProjeto", () => {
  it("remove espaços e aceita o mínimo", () => {
    expect(validarProjeto({ ...valido, nome: " \t A \n", cliente: "  B  " })).toEqual({
      nome: "A",
      cliente: "B",
      tipo: "site",
      status: "planejado",
      prazo: null,
      responsavel_id: null,
      observacoes: null,
    });
    const completo = validarProjeto({
      ...valido,
      prazo: "2026-02-28",
      responsavel_id: "u-1",
      observacoes: "  nota  ",
    });
    expect(completo).toMatchObject({ prazo: "2026-02-28", responsavel_id: "u-1", observacoes: "nota" });
    expect(validarProjeto({ ...valido, prazo: "", responsavel_id: "", observacoes: " \n " })).toMatchObject({
      prazo: null,
      responsavel_id: null,
      observacoes: null,
    });
  });

  it("rejeita nome vazio ou só espaços sem chamar o banco", async () => {
    expect(() => validarProjeto({ ...valido, nome: "" })).toThrow("Informe o nome do projeto.");
    expect(() => validarProjeto({ ...valido, nome: " \t\n " })).toThrow("Informe o nome do projeto.");
    expect(() => validarProjeto({ ...valido, nome: "a".repeat(121) })).toThrow(
      "O nome pode ter no máximo 120 caracteres.",
    );
    await expect(criarProjeto({ ...valido, nome: "   " })).rejects.toThrow("Informe o nome do projeto.");
    expect(from).not.toHaveBeenCalled();
    expect(getSupabase).not.toHaveBeenCalled();
  });

  it("rejeita cliente acima de 120", () => {
    expect(() => validarProjeto({ ...valido, cliente: "" })).toThrow("Informe o cliente.");
    expect(() => validarProjeto({ ...valido, cliente: "c".repeat(121) })).toThrow(
      "O cliente pode ter no máximo 120 caracteres.",
    );
    expect(validarProjeto({ ...valido, cliente: "c".repeat(120) }).cliente).toHaveLength(120);
  });

  it("rejeita tipo/status fora da lista", () => {
    expect(() => validarProjeto({ ...valido, tipo: "app" as never })).toThrow("Escolha um tipo válido.");
    expect(() => validarProjeto({ ...valido, status: "feito" as never })).toThrow("Escolha um status válido.");
  });

  it("rejeita observações acima de 2000", () => {
    expect(() => validarProjeto({ ...valido, observacoes: "o".repeat(2001) })).toThrow(
      "As observações podem ter no máximo 2000 caracteres.",
    );
    expect(validarProjeto({ ...valido, observacoes: "o".repeat(2000) }).observacoes).toHaveLength(2000);
  });

  it("rejeita prazo que não é data de calendário", () => {
    for (const ruim of ["2026-02-30", "abc", "26-01-01", "2026-1-1", "2026-13-01"]) {
      expect(() => validarProjeto({ ...valido, prazo: ruim })).toThrow("Informe um prazo válido.");
    }
  });
});

describe("hojeEmSaoPaulo", () => {
  it("2026-03-10T02:30:00Z ainda é dia 9 em São Paulo", () => {
    expect(hojeEmSaoPaulo(new Date("2026-03-10T02:30:00Z"))).toBe("2026-03-09");
  });

  it("2026-03-10T03:00:00Z já é dia 10 em São Paulo", () => {
    expect(hojeEmSaoPaulo(new Date("2026-03-10T03:00:00Z"))).toBe("2026-03-10");
  });
});

describe("estaAtrasado", () => {
  const hoje = "2026-03-10";
  it("prazo de ontem e em andamento: atrasado", () => {
    expect(estaAtrasado({ prazo: "2026-03-09", status: "em_andamento" }, hoje)).toBe(true);
  });
  it("prazo de hoje: não", () => {
    expect(estaAtrasado({ prazo: "2026-03-10", status: "em_andamento" }, hoje)).toBe(false);
  });
  it("prazo de amanhã: não", () => {
    expect(estaAtrasado({ prazo: "2026-03-11", status: "planejado" }, hoje)).toBe(false);
  });
  it("prazo vencido mas concluído: não", () => {
    expect(estaAtrasado({ prazo: "2026-03-01", status: "concluido" }, hoje)).toBe(false);
  });
  it("sem prazo: não", () => {
    expect(estaAtrasado({ prazo: null, status: "em_andamento" }, hoje)).toBe(false);
  });
});

describe("criarProjeto", () => {
  it("envia os dados já validados e normalizados", async () => {
    await criarProjeto({ ...valido, nome: "  Site  ", prazo: "", observacoes: "" });
    expect(from).toHaveBeenCalledWith("projetos");
    expect(insert).toHaveBeenCalledWith({
      nome: "Site",
      cliente: "Cliente Teste",
      tipo: "site",
      status: "planejado",
      prazo: null,
      responsavel_id: null,
      observacoes: null,
    });
  });

  it("lança o erro do banco como veio", async () => {
    const erro = { code: "42501", message: "x" };
    insert.mockResolvedValue({ error: erro });
    await expect(criarProjeto(valido)).rejects.toBe(erro);
  });
});

describe("atualizarProjeto e apagarProjeto", () => {
  it("zero linhas afetadas vira erro neutro (não de permissão)", async () => {
    selectAtualizar.mockResolvedValue({ data: [], error: null });
    const e1 = await atualizarProjeto("p-1", valido).catch((e: unknown) => e);
    expect(mensagemDeErro(e1)).toBe("O projeto não foi salvo: ele pode ter sido apagado ou seu acesso mudou.");
    selectApagar.mockResolvedValue({ data: [], error: null });
    const e2 = await apagarProjeto("p-1").catch((e: unknown) => e);
    expect(mensagemDeErro(e2)).toBe("O projeto não foi salvo: ele pode ter sido apagado ou seu acesso mudou.");
    selectApagar.mockResolvedValue({ data: null, error: null });
    await expect(apagarProjeto("p-1")).rejects.toBeTruthy();
  });

  it("uma linha afetada resolve", async () => {
    await expect(atualizarProjeto("p-1", valido)).resolves.toBeUndefined();
    expect(eqAtualizar).toHaveBeenCalledWith("id", "p-1");
    expect(selectAtualizar).toHaveBeenCalledWith("id");
    await expect(apagarProjeto("p-1")).resolves.toBeUndefined();
    expect(eqApagar).toHaveBeenCalledWith("id", "p-1");
  });

  it("atualizar valida antes de chamar o banco e lança erro do banco", async () => {
    await expect(atualizarProjeto("p-1", { ...valido, nome: "" })).rejects.toThrow("Informe o nome do projeto.");
    expect(from).not.toHaveBeenCalled();
    const erro = { code: "XX000", message: "x" };
    selectAtualizar.mockResolvedValue({ data: null, error: erro });
    await expect(atualizarProjeto("p-1", valido)).rejects.toBe(erro);
  });
});

describe("listarProjetos", () => {
  it("pede ordem por prazo (nulos no fim) e nome", async () => {
    order2.mockResolvedValue({ data: [{ id: "p-1" }], error: null });
    expect(await listarProjetos()).toHaveLength(1);
    expect(select).toHaveBeenCalledWith("*");
    expect(order1).toHaveBeenCalledWith("prazo", { ascending: true, nullsFirst: false });
    expect(order2).toHaveBeenCalledWith("nome");
  });

  it("lança o erro do banco", async () => {
    order2.mockResolvedValue({ data: null, error: { code: "42501", message: "x" } });
    await expect(listarProjetos()).rejects.toBeTruthy();
  });
});

describe("listarEquipe", () => {
  it("chama a função equipe", async () => {
    rpc.mockResolvedValue({ data: [{ id: "u-1", email: "a@exemplo.test", papel: "admin" }], error: null });
    expect(await listarEquipe()).toEqual([{ id: "u-1", email: "a@exemplo.test", papel: "admin" }]);
    expect(rpc).toHaveBeenCalledWith("equipe");
  });

  it("devolve lista vazia quando não há dados", async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    expect(await listarEquipe()).toEqual([]);
  });
});

describe("contarEmAndamento", () => {
  it("conta com head count filtrando por em_andamento", async () => {
    expect(await contarEmAndamento()).toBe(3);
    expect(select).toHaveBeenCalledWith("id", { count: "exact", head: true });
    expect(eqContar).toHaveBeenCalledWith("status", "em_andamento");
  });

  it("devolve 0 quando count é nulo", async () => {
    eqContar.mockResolvedValue({ count: null, error: null });
    expect(await contarEmAndamento()).toBe(0);
  });
});

describe("mensagemDeErro", () => {
  it("23514 comum vira mensagem de valor inválido; ultimo admin continua com a sua mensagem; texto desconhecido não vaza", () => {
    expect(mensagemDeErro({ code: "23514", message: "violates check constraint projetos_nome_check" })).toBe(
      "Algum campo está com um valor inválido.",
    );
    expect(mensagemDeErro({ code: "23514", message: "Operacao negada: nao pode ficar sem ultimo admin ativo" })).toBe(
      "É preciso manter pelo menos um admin ativo.",
    );
    const m = mensagemDeErro({ code: "XX000", message: "segredo interno do banco" });
    expect(m).toBe("Não foi possível concluir a operação. Tente novamente.");
    expect(m).not.toContain("segredo");
  });

  it("sem Supabase configurado: Painel ainda não configurado.", async () => {
    vi.mocked(getSupabase).mockReturnValue(null);
    const erro = await listarProjetos().catch((e: unknown) => e);
    expect(mensagemDeErro(erro)).toBe("Painel ainda não configurado.");
  });
});

describe("mensagens genéricas de erro", () => {
  it("23505 em projetos é genérico; o texto de e-mail fica em membros", () => {
    expect(mensagemDeErro({ code: "23505", message: "duplicate key" })).toBe("Esse registro já existe.");
  });
});
