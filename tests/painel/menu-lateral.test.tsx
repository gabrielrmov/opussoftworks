// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Casca } from "@/components/painel/casca";
import { MenuLateral } from "@/components/painel/menu-lateral";
import { sair } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("@/lib/painel/projetos", () => ({ contarEmAndamento: vi.fn().mockResolvedValue(0) }));
const pathnameAtual = vi.hoisted(() => ({ valor: "/painel" }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameAtual.valor,
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("MenuLateral", () => {
  afterEach(cleanup);

  it("membro não vê o item Membros", () => {
    render(<MenuLateral papel="membro" />);
    expect(screen.queryByText("Membros")).toBeNull();
    expect(screen.getByRole("link", { name: "Visão geral" })).toBeTruthy();
  });

  it("admin vê o item Membros com href /painel/membros", () => {
    render(<MenuLateral papel="admin" />);
    expect(screen.getByRole("link", { name: "Membros" }).getAttribute("href")).toBe("/painel/membros");
  });

  it("Projetos e equipe é um link para /painel/projetos", () => {
    render(<MenuLateral papel="membro" />);
    expect(screen.getByRole("link", { name: "Projetos e equipe" }).getAttribute("href")).toBe("/painel/projetos");
  });

  it("Clientes e comercial, Financeiro e Campanhas continuam não-links com 'em breve'", () => {
    render(<MenuLateral papel="membro" />);
    for (const nome of ["Clientes e comercial", "Financeiro", "Campanhas"]) {
      expect(screen.queryByRole("link", { name: new RegExp(nome) })).toBeNull();
      expect(screen.getByText(nome).closest("li")?.getAttribute("aria-disabled")).toBe("true");
    }
    expect(screen.getAllByText("em breve")).toHaveLength(3);
  });

  it("item ativo tem aria-current em /painel/projetos", () => {
    pathnameAtual.valor = "/painel/projetos";
    try {
      render(<MenuLateral papel="membro" />);
      expect(screen.getByRole("link", { name: "Projetos e equipe" }).getAttribute("aria-current")).toBe("page");
      expect(screen.getByRole("link", { name: "Visão geral" }).getAttribute("aria-current")).toBeNull();
    } finally {
      pathnameAtual.valor = "/painel";
    }
  });

  it("ícones são aria-hidden", () => {
    render(<MenuLateral papel="admin" />);
    const icones = document.querySelectorAll("nav svg");
    expect(icones.length).toBeGreaterThanOrEqual(6);
    icones.forEach((i) => expect(i.getAttribute("aria-hidden")).toBe("true"));
  });

  it("Membros fica sob o rótulo Administração só para admin", () => {
    const { unmount } = render(<MenuLateral papel="membro" />);
    expect(screen.queryByText("Administração")).toBeNull();
    unmount();
    render(<MenuLateral papel="admin" />);
    expect(screen.getByText("Administração")).toBeTruthy();
  });
});

describe("Casca", () => {
  afterEach(cleanup);

  it("Sair chama sair e mostra o e-mail", () => {
    render(
      <Casca papel="membro" email="a@b.com">
        <p>x</p>
      </Casca>,
    );
    expect(screen.getByText("a@b.com")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(sair).toHaveBeenCalledTimes(1);
  });

  it("renderiza acaoTopo e o botão Alternar tema na barra superior", () => {
    render(
      <Casca papel="membro" email="a@b.com" acaoTopo={<button type="button">Novo</button>}>
        <p>x</p>
      </Casca>,
    );
    expect(screen.getByRole("button", { name: "Novo" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Alternar tema" })).toBeTruthy();
  });
});
