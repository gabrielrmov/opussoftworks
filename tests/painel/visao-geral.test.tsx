// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PainelPage from "@/app/painel/page";
import { contarEmAndamento } from "@/lib/painel/projetos";
import { useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("@/lib/painel/projetos", () => ({ contarEmAndamento: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/painel",
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("/painel (visão geral)", () => {
  beforeEach(() => {
    vi.mocked(useAcesso).mockReturnValue({ estado: "ok", papel: "membro", email: "a@b.com" });
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("cartão de Projetos mostra 'N em andamento'", async () => {
    vi.mocked(contarEmAndamento).mockResolvedValue(3);
    render(<PainelPage />);
    expect(screen.getByText("Carregando…")).toBeTruthy();
    expect(await screen.findByText("3 em andamento")).toBeTruthy();
    const link = within(screen.getByRole("main")).getByRole("link", { name: /Projetos e equipe/ });
    expect(link.getAttribute("href")).toBe("/painel/projetos");
    expect(link.textContent).toContain("3 em andamento");
  });

  it("se a contagem falhar mostra '—' sem quebrar a página", async () => {
    vi.mocked(contarEmAndamento).mockRejectedValue(new Error("falhou"));
    render(<PainelPage />);
    expect(await screen.findByText("—")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Visão geral" })).toBeTruthy();
  });

  it("os outros três cartões continuam 'Em breve'", async () => {
    vi.mocked(contarEmAndamento).mockResolvedValue(1);
    render(<PainelPage />);
    await waitFor(() => expect(screen.getByText("1 em andamento")).toBeTruthy());
    expect(screen.getAllByText("Em breve")).toHaveLength(3);
    for (const area of ["Clientes e comercial", "Financeiro", "Campanhas"]) {
      expect(screen.getByRole("heading", { name: area })).toBeTruthy();
    }
  });
});
