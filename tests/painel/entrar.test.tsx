// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EntrarPage from "@/app/painel/entrar/page";
import { entrarComGoogle, useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

const AUTORIZADA = "Esta conta Google não está autorizada a acessar o painel.";
const GENERICA = "Não foi possível entrar. Tente novamente.";

function abrir(url: string) {
  window.history.replaceState(null, "", url);
  return render(<EntrarPage />);
}

describe("página de entrar", () => {
  beforeEach(() => {
    vi.mocked(useAcesso).mockReturnValue({ estado: "sem-sessao" });
    vi.mocked(entrarComGoogle).mockReset();
    vi.mocked(entrarComGoogle).mockResolvedValue(undefined);
  });
  afterEach(cleanup);

  it("sem erro não mostra alerta", () => {
    abrir("/painel/entrar");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("access_denied mostra a mensagem de conta não autorizada", async () => {
    abrir("/painel/entrar?error=access_denied");
    expect(await screen.findByText(AUTORIZADA)).toBeTruthy();
    expect(screen.getByText("Não foi possível entrar")).toBeTruthy();
  });

  it("descrição do hook mostra a mensagem de conta não autorizada", async () => {
    abrir("/painel/entrar?error=server_error&error_description=Acesso+restrito.");
    expect(await screen.findByText(AUTORIZADA)).toBeTruthy();
  });

  it("lê o erro também do fragmento", async () => {
    abrir("/painel/entrar#error=access_denied");
    expect(await screen.findByText(AUTORIZADA)).toBeTruthy();
  });

  it("erro desconhecido mostra a mensagem genérica e nunca o texto cru", async () => {
    abrir("/painel/entrar?error=boom&error_description=Texto+malicioso+da+URL");
    expect(await screen.findByText(GENERICA)).toBeTruthy();
    expect(screen.queryByText(/Texto malicioso da URL/)).toBeNull();
    expect(screen.queryByText("boom")).toBeNull();
  });

  it("o clique chama entrarComGoogle", () => {
    abrir("/painel/entrar");
    fireEvent.click(screen.getByRole("button", { name: "Entrar com Google" }));
    expect(entrarComGoogle).toHaveBeenCalledTimes(1);
  });

  it("falha em entrarComGoogle mostra a mensagem genérica", async () => {
    vi.mocked(entrarComGoogle).mockRejectedValue(new Error("rede"));
    abrir("/painel/entrar");
    fireEvent.click(screen.getByRole("button", { name: "Entrar com Google" }));
    expect(await screen.findByText(GENERICA)).toBeTruthy();
    expect(screen.queryByText(/rede/)).toBeNull();
  });

  it("botão desabilitado quando o painel não está configurado", async () => {
    vi.mocked(useAcesso).mockReturnValue({ estado: "nao-configurado" });
    abrir("/painel/entrar");
    const botao = screen.getByRole("button", { name: "Entrar com Google" }) as HTMLButtonElement;
    await waitFor(() => expect(botao.disabled).toBe(true));
  });
});
