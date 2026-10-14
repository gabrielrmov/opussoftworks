// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Casca } from "@/components/painel/casca";
import { MenuLateral } from "@/components/painel/menu-lateral";
import PainelPage from "@/app/painel/page";
import { sair, useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("next/navigation", () => ({
  usePathname: () => "/painel",
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

  it("áreas sem página não são links", () => {
    render(<MenuLateral papel="membro" />);
    expect(screen.queryByRole("link", { name: /Financeiro/ })).toBeNull();
    expect(screen.getByText("Financeiro")).toBeTruthy();
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
});

describe("/painel", () => {
  afterEach(cleanup);

  it("os quatro cartões de área aparecem com 'Em breve'", () => {
    vi.mocked(useAcesso).mockReturnValue({ estado: "ok", papel: "membro", email: "a@b.com" });
    render(<PainelPage />);
    expect(screen.getAllByText("Em breve")).toHaveLength(4);
    for (const area of ["Projetos e equipe", "Clientes e comercial", "Financeiro", "Campanhas"]) {
      expect(screen.getByRole("heading", { name: area })).toBeTruthy();
    }
  });
});
