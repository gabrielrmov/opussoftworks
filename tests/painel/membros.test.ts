import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabase } from "@/lib/supabase/client";
import { adicionarMembro, definirAtivo, listarMembros, mensagemDeErro } from "@/lib/painel/membros";

vi.mock("@/lib/supabase/client");

const insert = vi.fn();
const eq = vi.fn();
const update = vi.fn(() => ({ eq }));
const order = vi.fn();
const select = vi.fn(() => ({ order }));
const from = vi.fn(() => ({ insert, update, select }));

beforeEach(() => {
  vi.clearAllMocks();
  insert.mockResolvedValue({ error: null });
  eq.mockResolvedValue({ error: null });
  order.mockResolvedValue({ data: [], error: null });
  vi.mocked(getSupabase).mockReturnValue({ from } as never);
});

describe("membros", () => {
  it("adicionarMembro normaliza o e-mail para minúsculas e sem espaços", async () => {
    await adicionarMembro("  Ana@Exemplo.TEST ", "membro");
    expect(from).toHaveBeenCalledWith("membros");
    expect(insert).toHaveBeenCalledWith({ email: "ana@exemplo.test", papel: "membro" });
  });

  it("adicionarMembro rejeita e-mail inválido sem chamar o banco", async () => {
    await expect(adicionarMembro("nao-e-email", "admin")).rejects.toThrow("Informe um e-mail válido.");
    expect(from).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it("definirAtivo envia ativo=false para o id certo", async () => {
    await definirAtivo("id-1", false);
    expect(update).toHaveBeenCalledWith({ ativo: false });
    expect(eq).toHaveBeenCalledWith("id", "id-1");
  });

  it("erro do banco vira mensagem em português", async () => {
    eq.mockResolvedValue({ error: { code: "23514", message: "Operacao negada: nao pode ficar sem ultimo admin ativo" } });
    const erro = await definirAtivo("id-1", false).catch((e: unknown) => e);
    expect(mensagemDeErro(erro)).toBe("É preciso manter pelo menos um admin ativo.");
  });

  it("listarMembros lê ordenado por e-mail e lança erro do banco", async () => {
    order.mockResolvedValueOnce({ data: [{ id: "1", email: "a@exemplo.test", papel: "admin", ativo: true }], error: null });
    expect(await listarMembros()).toHaveLength(1);
    expect(select).toHaveBeenCalledWith("id, email, papel, ativo");
    expect(order).toHaveBeenCalledWith("email");
    order.mockResolvedValueOnce({ data: null, error: { code: "42501", message: "x" } });
    await expect(listarMembros()).rejects.toBeTruthy();
  });
});

describe("mensagemDeErro", () => {
  it("mapeia os casos conhecidos", () => {
    expect(mensagemDeErro({ code: "23505", message: "duplicate key" })).toBe("Este e-mail já está na lista.");
    expect(mensagemDeErro({ message: "Operacao negada: nao pode ficar sem ultimo admin ativo" })).toBe(
      "É preciso manter pelo menos um admin ativo.",
    );
    expect(mensagemDeErro({ code: "42501", message: "x" })).toBe("Você não tem permissão para fazer isso.");
    expect(mensagemDeErro({ message: "permission denied for table membros" })).toBe(
      "Você não tem permissão para fazer isso.",
    );
    expect(mensagemDeErro({ message: "new row violates row-level security policy" })).toBe(
      "Você não tem permissão para fazer isso.",
    );
  });

  it("mantém a mensagem de validação", async () => {
    const erro = await adicionarMembro("x", "membro").catch((e: unknown) => e);
    expect(mensagemDeErro(erro)).toBe("Informe um e-mail válido.");
  });

  it("painel não configurado", async () => {
    vi.mocked(getSupabase).mockReturnValue(null);
    const erro = await listarMembros().catch((e: unknown) => e);
    expect(mensagemDeErro(erro)).toBe("Painel ainda não configurado.");
  });

  it("desconhecido vira genérico e não vaza o texto original", () => {
    const m = mensagemDeErro({ code: "XX000", message: "segredo interno do banco" });
    expect(m).toBe("Não foi possível concluir a operação. Tente novamente.");
    expect(m).not.toContain("segredo");
  });
});
