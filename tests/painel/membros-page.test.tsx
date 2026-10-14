// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MembrosPage from "@/app/painel/membros/page";
import { definirAtivo, listarMembros, type Membro } from "@/lib/painel/membros";
import { useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("@/lib/painel/membros", async (orig) => ({
  ...(await orig<typeof import("@/lib/painel/membros")>()),
  listarMembros: vi.fn(),
  adicionarMembro: vi.fn(),
  definirAtivo: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/painel/membros",
  useRouter: () => ({ replace: vi.fn() }),
}));

const membros: Membro[] = [
  { id: "1", email: "eu@exemplo.test", papel: "admin", ativo: true },
  { id: "2", email: "outro@exemplo.test", papel: "membro", ativo: true },
];

describe("página de membros", () => {
  beforeEach(() => {
    vi.mocked(useAcesso).mockReturnValue({ estado: "ok", papel: "admin", email: "Eu@Exemplo.test" });
    vi.mocked(listarMembros).mockResolvedValue(membros);
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("admin vê a lista", async () => {
    render(<MembrosPage />);
    expect(await screen.findByText("outro@exemplo.test")).toBeTruthy();
    expect(screen.getByText("eu@exemplo.test")).toBeTruthy();
  });

  it("desativar na própria linha fica desabilitado", async () => {
    render(<MembrosPage />);
    await screen.findByText("outro@exemplo.test");
    const botoes = screen.getAllByRole("button", { name: /Desativar/ }) as HTMLButtonElement[];
    expect(botoes).toHaveLength(2);
    expect(botoes[0].disabled).toBe(true);
    expect(botoes[1].disabled).toBe(false);
  });

  it("erro do banco aparece em português", async () => {
    vi.mocked(definirAtivo).mockRejectedValue({ message: "Operacao negada: nao pode ficar sem ultimo admin ativo" });
    render(<MembrosPage />);
    await screen.findByText("outro@exemplo.test");
    fireEvent.click(screen.getAllByRole("button", { name: /Desativar/ })[1]);
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("É preciso manter pelo menos um admin ativo."));
  });
});
