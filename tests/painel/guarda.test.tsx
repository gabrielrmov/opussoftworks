// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Guarda } from "@/components/painel/guarda";
import { sair, useAcesso, type Acesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

function com(acesso: Acesso) {
  vi.mocked(useAcesso).mockReturnValue(acesso);
}

function renderizar(papel?: "admin") {
  return render(
    <Guarda papel={papel}>
      <p>conteudo secreto</p>
    </Guarda>,
  );
}

describe("Guarda", () => {
  beforeEach(() => {
    replace.mockClear();
    window.history.replaceState(null, "", "/painel");
  });
  afterEach(cleanup);

  it("não renderiza children enquanto carrega", () => {
    com({ estado: "carregando" });
    renderizar();
    expect(screen.queryByText("conteudo secreto")).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  it("sem sessão redireciona para /painel/entrar e não mostra children", () => {
    com({ estado: "sem-sessao" });
    renderizar();
    expect(screen.queryByText("conteudo secreto")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/painel/entrar");
  });

  it("sem sessão preserva a query string no redirecionamento", () => {
    window.history.replaceState(null, "", "/painel?error_description=acesso+negado");
    com({ estado: "sem-sessao" });
    renderizar();
    expect(replace).toHaveBeenCalledWith("/painel/entrar?error_description=acesso+negado");
  });

  it("sem acesso mostra a mensagem e o botão Sair, sem children", () => {
    com({ estado: "sem-acesso", email: "a@b.com" });
    renderizar();
    expect(screen.getByText("Você não tem acesso a este painel")).toBeTruthy();
    expect(screen.queryByText("conteudo secreto")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(sair).toHaveBeenCalledTimes(1);
  });

  it("ok renderiza children", () => {
    com({ estado: "ok", papel: "membro", email: "a@b.com" });
    renderizar();
    expect(screen.getByText("conteudo secreto")).toBeTruthy();
  });

  it("exigindo admin, membro comum vê aviso de permissão", () => {
    com({ estado: "ok", papel: "membro", email: "a@b.com" });
    renderizar("admin");
    expect(screen.queryByText("conteudo secreto")).toBeNull();
    expect(screen.getByRole("heading", { name: "Sem permissão" })).toBeTruthy();
  });

  it("exigindo admin, admin vê children", () => {
    com({ estado: "ok", papel: "admin", email: "a@b.com" });
    renderizar("admin");
    expect(screen.getByText("conteudo secreto")).toBeTruthy();
  });

  it("não configurado mostra o aviso e não quebra", () => {
    com({ estado: "nao-configurado" });
    renderizar();
    expect(screen.getByText("Painel ainda não configurado")).toBeTruthy();
    expect(screen.queryByText("conteudo secreto")).toBeNull();
  });
});
