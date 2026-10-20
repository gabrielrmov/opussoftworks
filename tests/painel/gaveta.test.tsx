// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Gaveta } from "@/components/painel/gaveta";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

function montar(props: Partial<React.ComponentProps<typeof Gaveta>> = {}) {
  const onFechar = vi.fn();
  const utils = render(
    <Gaveta aberta titulo="Novo projeto" bloqueada={false} onFechar={onFechar} {...props}>
      <input aria-label="Nome" />
      <button type="button">Salvar</button>
    </Gaveta>,
  );
  return { onFechar, ...utils };
}

describe("Gaveta", () => {
  it("fechada não renderiza o diálogo", () => {
    montar({ aberta: false });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByLabelText("Nome")).toBeNull();
  });

  it("aberta tem role dialog, aria-modal e rótulo pelo título", () => {
    montar();
    const d = screen.getByRole("dialog", { name: "Novo projeto" });
    expect(d.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByRole("heading", { name: "Novo projeto" })).toBeTruthy();
  });

  it("foca o primeiro campo ao abrir", () => {
    montar();
    expect(document.activeElement).toBe(screen.getByLabelText("Nome"));
  });

  it("Esc fecha", () => {
    const { onFechar } = montar();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onFechar).toHaveBeenCalledTimes(1);
  });

  it("clique no fundo fecha", () => {
    const { onFechar } = montar();
    fireEvent.click(screen.getByTestId("gaveta-fundo"));
    expect(onFechar).toHaveBeenCalledTimes(1);
  });

  it("Esc e fundo NÃO fecham quando bloqueada", () => {
    const { onFechar } = montar({ bloqueada: true });
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByTestId("gaveta-fundo"));
    expect(onFechar).not.toHaveBeenCalled();
  });

  it("devolve o foco ao acionador ao fechar", () => {
    const acionador = createRef<HTMLButtonElement>();
    function Teste({ aberta }: { aberta: boolean }) {
      return (
        <>
          <button ref={acionador}>Abrir</button>
          <Gaveta aberta={aberta} titulo="T" bloqueada={false} onFechar={() => {}} acionador={acionador}>
            <input aria-label="Nome" />
          </Gaveta>
        </>
      );
    }
    const { rerender } = render(<Teste aberta={false} />);
    rerender(<Teste aberta />);
    expect(document.activeElement).toBe(screen.getByLabelText("Nome"));
    rerender(<Teste aberta={false} />);
    expect(document.activeElement).toBe(screen.getByText("Abrir"));
  });

  it("sem acionador, devolve o foco ao elemento focado antes de abrir", () => {
    function Teste({ aberta }: { aberta: boolean }) {
      return (
        <>
          <button>Editar</button>
          <Gaveta aberta={aberta} titulo="T" bloqueada={false} onFechar={() => {}}>
            <input aria-label="Nome" />
          </Gaveta>
        </>
      );
    }
    const { rerender } = render(<Teste aberta={false} />);
    screen.getByText("Editar").focus();
    rerender(<Teste aberta />);
    rerender(<Teste aberta={false} />);
    expect(document.activeElement).toBe(screen.getByText("Editar"));
  });

  it("trava a rolagem do corpo só enquanto aberta", () => {
    const { rerender } = montar();
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Gaveta aberta={false} titulo="T" bloqueada={false} onFechar={() => {}}>
        <input />
      </Gaveta>,
    );
    expect(document.body.style.overflow).toBe("");
  });
});
