// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProjetosPage from "@/app/painel/projetos/page";
import { NovoProjetoLink } from "@/components/painel/novo-projeto-link";
import {
  apagarProjeto,
  atualizarProjeto,
  criarProjeto,
  listarEquipe,
  listarProjetos,
  type MembroEquipe,
  type Projeto,
} from "@/lib/painel/projetos";
import { useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("@/lib/painel/projetos", async (orig) => ({
  ...(await orig<typeof import("@/lib/painel/projetos")>()),
  listarProjetos: vi.fn(),
  listarEquipe: vi.fn(),
  criarProjeto: vi.fn(),
  atualizarProjeto: vi.fn(),
  apagarProjeto: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/painel/projetos",
  useRouter: () => ({ replace: vi.fn() }),
}));

const base = {
  tipo: "site",
  observacoes: null,
  criado_em: "2026-01-01T00:00:00Z",
  atualizado_em: "2026-01-01T00:00:00Z",
} as const;

const projetos: Projeto[] = [
  { ...base, id: "p1", nome: "Site Alfa", cliente: "Cliente A", status: "em_andamento", prazo: "2026-10-10", responsavel_id: "m1" },
  { ...base, id: "p2", nome: "Sistema Beta", cliente: "Cliente B", tipo: "sistema", status: "concluido", prazo: "2026-10-05", responsavel_id: null },
  { ...base, id: "p3", nome: "Tráfego Gama", cliente: "Cliente C", tipo: "trafego", status: "planejado", prazo: "2026-12-01", responsavel_id: "x" },
];

const equipe: MembroEquipe[] = [
  { id: "m1", email: "ana@exemplo.test", papel: "admin" },
  { id: "m2", email: "bia@exemplo.test", papel: "membro" },
];

function deferida<T>() {
  let resolver!: (v: T) => void;
  const promessa = new Promise<T>((r) => (resolver = r));
  return { promessa, resolver };
}

describe("página de projetos", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-20T15:00:00Z"));
    vi.mocked(useAcesso).mockReturnValue({ estado: "ok", papel: "admin", email: "ana@exemplo.test" });
    vi.mocked(listarProjetos).mockResolvedValue(projetos);
    vi.mocked(listarEquipe).mockResolvedValue(equipe);
    vi.mocked(criarProjeto).mockResolvedValue(undefined);
    vi.mocked(atualizarProjeto).mockResolvedValue(undefined);
    vi.mocked(apagarProjeto).mockResolvedValue(undefined);
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("mostra carregando e depois a lista com nome, cliente, tipo, status, prazo e responsável", async () => {
    render(<ProjetosPage />);
    expect(screen.getByRole("status").textContent).toBe("Carregando…");
    const item = (await screen.findByRole("heading", { name: "Site Alfa" })).closest("li")!;
    const q = within(item);
    expect(q.getByText("Cliente A")).toBeTruthy();
    expect(q.getByText("Site")).toBeTruthy();
    expect(q.getByText("Em andamento")).toBeTruthy();
    expect(q.getByText(/10\/10\/2026/)).toBeTruthy();
    expect(q.getByText("ana@exemplo.test")).toBeTruthy();
    const outro = screen.getByRole("heading", { name: "Sistema Beta" }).closest("li")!;
    expect(within(outro).getByText("—")).toBeTruthy();
    const fora = screen.getByRole("heading", { name: "Tráfego Gama" }).closest("li")!;
    expect(within(fora).getByText("Fora da equipe ativa")).toBeTruthy();
  });

  it("estado vazio: Nenhum projeto ainda", async () => {
    vi.mocked(listarProjetos).mockResolvedValue([]);
    render(<ProjetosPage />);
    expect(await screen.findByText("Nenhum projeto ainda.")).toBeTruthy();
  });

  it("erro de carga mostra a mensagem em português e não o texto cru", async () => {
    vi.mocked(listarProjetos).mockRejectedValue({ code: "42501", message: "permission denied for table projetos" });
    render(<ProjetosPage />);
    const alerta = await screen.findByRole("alert");
    expect(alerta.textContent).toBe("Você não tem permissão para fazer isso.");
    expect(screen.queryByText(/permission denied/)).toBeNull();
  });

  it("filtro segmentado marca aria-pressed e filtra", async () => {
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    const grupo = screen.getByRole("group", { name: "Filtrar por status" });
    const todos = within(grupo).getByRole("button", { name: "Todos" });
    expect(todos.getAttribute("aria-pressed")).toBe("true");
    const planejado = within(grupo).getByRole("button", { name: "Planejado" });
    expect(planejado.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(planejado);
    expect(planejado.getAttribute("aria-pressed")).toBe("true");
    expect(todos.getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByRole("heading", { name: "Site Alfa" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Tráfego Gama" })).toBeTruthy();
    fireEvent.click(todos);
    expect(screen.getByRole("heading", { name: "Site Alfa" })).toBeTruthy();
  });

  it("busca ignora acentos e caixa e filtra por cliente", async () => {
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    const busca = screen.getByLabelText("Buscar por nome ou cliente");
    fireEvent.change(busca, { target: { value: "TRAFEGO" } });
    expect(screen.getByRole("heading", { name: "Tráfego Gama" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Site Alfa" })).toBeNull();
    fireEvent.change(busca, { target: { value: "cliente b" } });
    expect(screen.getByRole("heading", { name: "Sistema Beta" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Tráfego Gama" })).toBeNull();
    fireEvent.change(busca, { target: { value: "zzz" } });
    expect(screen.getByText("Nenhum projeto encontrado.")).toBeTruthy();
  });

  it("contagem do cabeçalho mostra projetos e vencidos", async () => {
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    expect(screen.getByText("3 projetos · 1 com prazo vencido")).toBeTruthy();
  });

  it("?novo=1 abre a gaveta vazia", async () => {
    window.history.pushState({}, "", "/painel/projetos?novo=1");
    try {
      render(<ProjetosPage />);
      const dialogo = await screen.findByRole("dialog", { name: "Novo projeto" });
      expect((within(dialogo).getByLabelText("Nome") as HTMLInputElement).value).toBe("");
    } finally {
      window.history.pushState({}, "", "/");
    }
  });

  it("sem ?novo=1 a gaveta começa fechada", async () => {
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abrir Editar de outro projeto não herda valores do anterior", async () => {
    render(<ProjetosPage />);
    const a = (await screen.findByRole("heading", { name: "Site Alfa" })).closest("li")!;
    fireEvent.click(within(a).getByRole("button", { name: "Editar" }));
    let q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "digitado" } });
    fireEvent.click(q.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    const b = screen.getByRole("heading", { name: "Sistema Beta" }).closest("li")!;
    fireEvent.click(within(b).getByRole("button", { name: "Editar" }));
    q = within(screen.getByRole("form", { name: "Projeto" }));
    expect((q.getByLabelText("Nome") as HTMLInputElement).value).toBe("Sistema Beta");
    expect((q.getByLabelText("Cliente") as HTMLInputElement).value).toBe("Cliente B");
    expect((q.getByLabelText("Status") as HTMLSelectElement).value).toBe("concluido");
    expect(screen.getByRole("dialog", { name: "Editar projeto" })).toBeTruthy();
  });

  it("Cancelar e Esc ficam bloqueados enquanto salva", async () => {
    const d = deferida<void>();
    vi.mocked(criarProjeto).mockReturnValue(d.promessa);
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "N" } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "C" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect((q.getByRole("button", { name: "Cancelar" }) as HTMLButtonElement).disabled).toBe(true));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByTestId("gaveta-fundo"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    await act(async () => d.resolver());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("prazo vencido e não concluído mostra 'atrasado'", async () => {
    render(<ProjetosPage />);
    const atrasado = (await screen.findByRole("heading", { name: "Site Alfa" })).closest("li")!;
    expect(within(atrasado).getByText(/atrasado/i)).toBeTruthy();
    const concluido = screen.getByRole("heading", { name: "Sistema Beta" }).closest("li")!;
    expect(within(concluido).queryByText(/atrasado/i)).toBeNull();
    const futuro = screen.getByRole("heading", { name: "Tráfego Gama" }).closest("li")!;
    expect(within(futuro).queryByText(/atrasado/i)).toBeNull();
  });

  it("criar: campos obrigatórios; Salvar chama criarProjeto com os dados normalizados e recarrega", async () => {
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const form = screen.getByRole("form", { name: "Projeto" });
    const q = within(form);
    expect((q.getByLabelText("Status") as HTMLSelectElement).value).toBe("planejado");
    expect((q.getByLabelText("Tipo") as HTMLSelectElement).value).toBe("site");

    // Obrigatórios vazios: validação em português, sem chamar a biblioteca de escrita.
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    expect((await q.findByRole("alert")).textContent).toBe("Informe o nome do projeto.");
    expect(criarProjeto).not.toHaveBeenCalled();

    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "  Novo  " } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "Cliente Z" } });
    fireEvent.change(q.getByLabelText("Prazo"), { target: { value: "2026-11-30" } });
    fireEvent.change(q.getByLabelText("Responsável"), { target: { value: "m2" } });
    vi.mocked(listarProjetos).mockClear();
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(criarProjeto).toHaveBeenCalledTimes(1));
    expect(vi.mocked(criarProjeto).mock.calls[0][0]).toMatchObject({
      nome: "  Novo  ",
      cliente: "Cliente Z",
      tipo: "site",
      status: "planejado",
      prazo: "2026-11-30",
      responsavel_id: "m2",
    });
    await waitFor(() => expect(screen.queryByRole("form", { name: "Projeto" })).toBeNull());
    expect(listarProjetos).toHaveBeenCalledTimes(1);
  });

  it("editar abre o formulário preenchido e chama atualizarProjeto", async () => {
    render(<ProjetosPage />);
    const item = (await screen.findByRole("heading", { name: "Site Alfa" })).closest("li")!;
    fireEvent.click(within(item).getByRole("button", { name: "Editar" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    expect((q.getByLabelText("Nome") as HTMLInputElement).value).toBe("Site Alfa");
    expect((q.getByLabelText("Cliente") as HTMLInputElement).value).toBe("Cliente A");
    expect((q.getByLabelText("Status") as HTMLSelectElement).value).toBe("em_andamento");
    expect((q.getByLabelText("Prazo") as HTMLInputElement).value).toBe("2026-10-10");
    expect((q.getByLabelText("Responsável") as HTMLSelectElement).value).toBe("m1");
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "Site Alfa 2" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(atualizarProjeto).toHaveBeenCalledTimes(1));
    expect(vi.mocked(atualizarProjeto).mock.calls[0][0]).toBe("p1");
    expect(vi.mocked(atualizarProjeto).mock.calls[0][1]).toMatchObject({ nome: "Site Alfa 2" });
  });

  it("botão Salvar fica desabilitado enquanto salva (sem duplicar)", async () => {
    const d = deferida<void>();
    vi.mocked(criarProjeto).mockReturnValue(d.promessa);
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "N" } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "C" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect((q.getByRole("button", { name: "Salvar" }) as HTMLButtonElement).disabled).toBe(true));
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    expect(criarProjeto).toHaveBeenCalledTimes(1);
    await act(async () => d.resolver());
    await waitFor(() => expect(screen.queryByRole("form", { name: "Projeto" })).toBeNull());
  });

  it("membro comum não vê o botão Apagar; admin vê", async () => {
    const { unmount } = render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    expect(screen.getAllByRole("button", { name: "Apagar" })).toHaveLength(3);
    unmount();
    vi.mocked(useAcesso).mockReturnValue({ estado: "ok", papel: "membro", email: "bia@exemplo.test" });
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeNull();
  });

  it("apagar exige confirmação em dois passos (primeiro clique só pede confirmar)", async () => {
    render(<ProjetosPage />);
    const item = (await screen.findByRole("heading", { name: "Site Alfa" })).closest("li")!;
    fireEvent.click(within(item).getByRole("button", { name: "Apagar" }));
    expect(apagarProjeto).not.toHaveBeenCalled();
    fireEvent.click(within(item).getByRole("button", { name: "Cancelar" }));
    expect(within(item).queryByRole("button", { name: "Confirmar exclusão" })).toBeNull();
    fireEvent.click(within(item).getByRole("button", { name: "Apagar" }));
    vi.mocked(listarProjetos).mockClear();
    fireEvent.click(within(item).getByRole("button", { name: "Confirmar exclusão" }));
    await waitFor(() => expect(apagarProjeto).toHaveBeenCalledWith("p1"));
    await waitFor(() => expect(listarProjetos).toHaveBeenCalledTimes(1));
  });

  it("lista a equipe e usa os membros ativos no seletor de responsável", async () => {
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    const bloco = screen.getByRole("region", { name: "Equipe" });
    expect(within(bloco).getByText("bia@exemplo.test")).toBeTruthy();
    expect(within(bloco).getByText("ana@exemplo.test")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const select = within(screen.getByRole("form", { name: "Projeto" })).getByLabelText("Responsável");
    const opcoes = within(select).getAllByRole("option").map((o) => o.textContent);
    expect(opcoes).toEqual(["Sem responsável", "ana@exemplo.test", "bia@exemplo.test"]);
  });

  it("falha ao carregar a equipe não esconde os projetos", async () => {
    vi.mocked(listarEquipe).mockRejectedValue(new Error("x"));
    render(<ProjetosPage />);
    expect(await screen.findByRole("heading", { name: "Site Alfa" })).toBeTruthy();
    expect(within(screen.getByRole("region", { name: "Equipe" })).getByText(/Não foi possível/)).toBeTruthy();
    const alfa = screen.getByRole("heading", { name: "Site Alfa" }).closest("li")!;
    await waitFor(() => expect(within(alfa).getByText("Indisponível")).toBeTruthy());
    const beta = screen.getByRole("heading", { name: "Sistema Beta" }).closest("li")!;
    expect(within(beta).getByText("—")).toBeTruthy();
  });

  it("carga antiga que chega depois de uma nova não sobrescreve a lista", async () => {
    const velha = deferida<Projeto[]>();
    const nova = deferida<Projeto[]>();
    vi.mocked(listarProjetos).mockReturnValueOnce(velha.promessa).mockReturnValueOnce(nova.promessa);
    vi.mocked(criarProjeto).mockResolvedValue(undefined);
    render(<ProjetosPage />);
    await waitFor(() => expect(listarProjetos).toHaveBeenCalledTimes(1));
    // Segunda carga disparada (após criar) antes de a primeira resolver.
    vi.mocked(listarEquipe).mockResolvedValue(equipe);
    fireEvent.click(await screen.findByRole("button", { name: "Novo projeto" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "N" } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "C" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(listarProjetos).toHaveBeenCalledTimes(2));
    await act(async () => nova.resolver([projetos[2]]));
    expect(await screen.findByRole("heading", { name: "Tráfego Gama" })).toBeTruthy();
    await act(async () => velha.resolver([projetos[0]]));
    expect(screen.queryByRole("heading", { name: "Site Alfa" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Tráfego Gama" })).toBeTruthy();
  });

  it("erro ao salvar mostra a mensagem mapeada", async () => {
    vi.mocked(criarProjeto).mockRejectedValue({ code: "42501", message: "permission denied" });
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "N" } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "C" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    expect((await q.findByRole("alert")).textContent).toBe("Você não tem permissão para fazer isso.");
    expect(screen.getByRole("form", { name: "Projeto" })).toBeTruthy();
  });

  it("falha na carga mostra o erro mapeado e NÃO mostra 'Nenhum projeto ainda.'", async () => {
    vi.mocked(listarProjetos).mockRejectedValue({ code: "42501", message: "permission denied" });
    render(<ProjetosPage />);
    expect((await screen.findByRole("alert")).textContent).toBe("Você não tem permissão para fazer isso.");
    expect(screen.queryByText("Nenhum projeto ainda.")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("Tentar novamente recarrega e mostra a lista", async () => {
    vi.mocked(listarProjetos).mockRejectedValueOnce({ code: "42501", message: "x" });
    render(<ProjetosPage />);
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("heading", { name: "Site Alfa" })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).toBeNull();
  });

  it("Cancelar fica desabilitado enquanto salva", async () => {
    const d = deferida<void>();
    vi.mocked(criarProjeto).mockReturnValue(d.promessa);
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "N" } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "C" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect((q.getByRole("button", { name: "Cancelar" }) as HTMLButtonElement).disabled).toBe(true));
    await act(async () => d.resolver());
    await waitFor(() => expect(screen.queryByRole("form", { name: "Projeto" })).toBeNull());
  });

  it("falha ao salvar mantém o formulário com os valores digitados", async () => {
    vi.mocked(criarProjeto).mockRejectedValue({ code: "42501", message: "x" });
    render(<ProjetosPage />);
    await screen.findByRole("heading", { name: "Site Alfa" });
    fireEvent.click(screen.getByRole("button", { name: "Novo projeto" }));
    const q = within(screen.getByRole("form", { name: "Projeto" }));
    fireEvent.change(q.getByLabelText("Nome"), { target: { value: "Meu nome" } });
    fireEvent.change(q.getByLabelText("Cliente"), { target: { value: "Meu cliente" } });
    fireEvent.click(q.getByRole("button", { name: "Salvar" }));
    expect((await q.findByRole("alert")).textContent).toBe("Você não tem permissão para fazer isso.");
    expect((q.getByLabelText("Nome") as HTMLInputElement).value).toBe("Meu nome");
    expect((q.getByLabelText("Cliente") as HTMLInputElement).value).toBe("Meu cliente");
    expect((q.getByRole("button", { name: "Cancelar" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("atalho Novo projeto com a página já aberta abre a gaveta vazia", async () => {
    window.history.pushState({}, "", "/painel/projetos");
    try {
      render(
        <>
          <NovoProjetoLink>Atalho novo</NovoProjetoLink>
          <ProjetosPage />
        </>,
      );
      await screen.findByRole("heading", { name: "Site Alfa" });
      expect(screen.queryByRole("dialog")).toBeNull();
      fireEvent.click(screen.getByText("Atalho novo"));
      const dialogo = await screen.findByRole("dialog", { name: "Novo projeto" });
      expect((within(dialogo).getByLabelText("Nome") as HTMLInputElement).value).toBe("");
    } finally {
      window.history.pushState({}, "", "/");
    }
  });

  it("?novo=1 é removido da URL depois de abrir", async () => {
    window.history.pushState({}, "", "/painel/projetos?novo=1");
    try {
      render(<ProjetosPage />);
      await screen.findByRole("dialog", { name: "Novo projeto" });
      expect(window.location.search).toBe("");
    } finally {
      window.history.pushState({}, "", "/");
    }
  });

  it("foco volta para Novo projeto e para Editar ao fechar", async () => {
    render(<ProjetosPage />);
    const item = (await screen.findByRole("heading", { name: "Site Alfa" })).closest("li")!;
    const novo = screen.getByRole("button", { name: "Novo projeto" });
    novo.focus();
    fireEvent.click(novo);
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(novo);
    const editar = within(item).getByRole("button", { name: "Editar" });
    editar.focus();
    fireEvent.click(editar);
    fireEvent.click(within(screen.getByRole("form", { name: "Projeto" })).getByRole("button", { name: "Cancelar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(editar);
  });
});
