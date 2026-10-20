// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AlternarTema } from "@/components/painel/tema";
import { CHAVE_TEMA } from "@/lib/painel/tema";

function montar() {
  return render(
    <div className="pn-raiz" data-tema="claro" data-testid="raiz">
      <AlternarTema />
    </div>,
  );
}

describe("AlternarTema", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("alterna de claro para escuro e atualiza data-tema do contêiner", () => {
    montar();
    const raiz = screen.getByTestId("raiz");
    fireEvent.click(screen.getByRole("button", { name: "Alternar tema" }));
    expect(raiz.getAttribute("data-tema")).toBe("escuro");
    fireEvent.click(screen.getByRole("button", { name: "Alternar tema" }));
    expect(raiz.getAttribute("data-tema")).toBe("claro");
  });

  it("persiste a escolha em localStorage", () => {
    montar();
    fireEvent.click(screen.getByRole("button", { name: "Alternar tema" }));
    expect(localStorage.getItem(CHAVE_TEMA)).toBe("escuro");
  });

  it("o botão tem nome acessível 'Alternar tema'", () => {
    montar();
    const botao = screen.getByRole("button", { name: "Alternar tema" });
    expect(botao.getAttribute("aria-label")).toBe("Alternar tema");
    expect(botao.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
