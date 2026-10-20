// @vitest-environment jsdom
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

  describe("SCRIPT_TEMA (jsdom)", () => {
    function rodar(valor: string | null) {
      const raiz = document.createElement("div");
      raiz.className = "pn-raiz";
      raiz.setAttribute("data-tema", "claro");
      const script = document.createElement("script");
      raiz.appendChild(script);
      vi.stubGlobal("localStorage", armazenamento(valor === null ? {} : { [CHAVE_TEMA]: valor }));
      Object.defineProperty(document, "currentScript", { value: script, configurable: true });
      try {
        new Function(SCRIPT_TEMA)();
      } finally {
        delete (document as unknown as Record<string, unknown>).currentScript;
      }
      return raiz.getAttribute("data-tema");
    }

    it("aplica escuro salvo", () => {
      expect(rodar("escuro")).toBe("escuro");
    });

    it("valor inválido vira claro", () => {
      expect(rodar("roxo")).toBe("claro");
    });

    it("não lança e deixa claro quando localStorage lança", () => {
      const raiz = document.createElement("div");
      raiz.setAttribute("data-tema", "claro");
      const script = document.createElement("script");
      raiz.appendChild(script);
      vi.stubGlobal("localStorage", armazenamentoQueLanca());
      Object.defineProperty(document, "currentScript", { value: script, configurable: true });
      try {
        expect(() => new Function(SCRIPT_TEMA)()).not.toThrow();
      } finally {
        delete (document as unknown as Record<string, unknown>).currentScript;
      }
      expect(raiz.getAttribute("data-tema")).toBe("claro");
    });
  });
});
