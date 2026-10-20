import { afterEach, describe, expect, it, vi } from "vitest";
import { CHAVE_TEMA, SCRIPT_TEMA, lerTema, salvarTema } from "@/lib/painel/tema";

function armazenamento(inicial: Record<string, string> = {}) {
  const dados = { ...inicial };
  return {
    getItem: (k: string) => (k in dados ? dados[k] : null),
    setItem: (k: string, v: string) => {
      dados[k] = v;
    },
  };
}

function armazenamentoQueLanca() {
  const erro = () => {
    throw new Error("indisponível");
  };
  return { getItem: erro, setItem: erro };
}

describe("tema", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lerTema devolve claro sem valor salvo", () => {
    vi.stubGlobal("localStorage", armazenamento());
    expect(lerTema()).toBe("claro");
  });

  it("lerTema lê escuro quando salvo", () => {
    vi.stubGlobal("localStorage", armazenamento({ [CHAVE_TEMA]: "escuro" }));
    expect(lerTema()).toBe("escuro");
  });

  it("lerTema ignora valor inválido e devolve claro", () => {
    vi.stubGlobal("localStorage", armazenamento({ [CHAVE_TEMA]: "roxo" }));
    expect(lerTema()).toBe("claro");
  });

  it("lerTema devolve claro quando localStorage lança erro", () => {
    vi.stubGlobal("localStorage", armazenamentoQueLanca());
    expect(lerTema()).toBe("claro");
  });

  it("salvarTema não lança quando localStorage lança", () => {
    vi.stubGlobal("localStorage", armazenamentoQueLanca());
    expect(() => salvarTema("escuro")).not.toThrow();
  });

  it("SCRIPT_TEMA executa sem erro quando localStorage lança e deixa data-tema claro", () => {
    const pai = { dataset: { tema: "claro" } as Record<string, string> };
    const script = { parentElement: pai };
    vi.stubGlobal("localStorage", armazenamentoQueLanca());
    vi.stubGlobal("document", { currentScript: script });
    expect(() => new Function(SCRIPT_TEMA)()).not.toThrow();
    expect(pai.dataset.tema).toBe("claro");
  });
});
