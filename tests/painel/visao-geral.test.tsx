// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PainelPage from "@/app/painel/page";
import { VisaoGeralView } from "@/components/painel/visao-geral-view";
import { listarEquipe, listarProjetos, type MembroEquipe, type Projeto } from "@/lib/painel/projetos";
import { resumirProjetos } from "@/lib/painel/resumo";
import { useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/painel/use-acesso");
vi.mock("@/lib/painel/projetos", async () => ({
  ...(await vi.importActual<typeof import("@/lib/painel/projetos")>("@/lib/painel/projetos")),
  listarProjetos: vi.fn(),
  listarEquipe: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/painel",
  useRouter: () => ({ replace: vi.fn() }),
}));

const HOJE = "2026-10-20";
const EQUIPE: MembroEquipe[] = [
  { id: "u1", email: "gabriel@x.com", papel: "admin" },
  { id: "u2", email: "rafael@x.com", papel: "membro" },
];

function projeto(extra: Partial<Projeto> & { nome: string }): Projeto {
  return {
    id: extra.nome,
    cliente: "Cliente",
    tipo: "site",
    status: "em_andamento",
    prazo: null,
    responsavel_id: "u1",
    observacoes: null,
    criado_em: "2026-10-01T00:00:00Z",
    atualizado_em: "2026-10-01T00:00:00Z",
    ...extra,
  };
}

const PROJETOS: Projeto[] = [
  projeto({ nome: "Site institucional", cliente: "Clínica Aurora", prazo: "2026-10-17", responsavel_id: "u2" }),
  projeto({ nome: "Sistema de agendamento", status: "em_revisao", prazo: "2026-10-19" }),
  projeto({ nome: "Campanha de lançamento", cliente: "Padaria Trigo", prazo: "2026-10-21" }),
  projeto({ nome: "Loja virtual", prazo: "2026-10-23", status: "planejado" }),
  projeto({ nome: "Bella Pet", status: "concluido" }),
];

function deferido<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promessa = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promessa, resolve, reject };
}

function viewDe(projetos: Projeto[]) {
  return (
    <VisaoGeralView
      resumo={resumirProjetos(projetos, EQUIPE, HOJE)}
      saudacao="Bom dia"
      dataTexto="Terça, 20 de outubro"
    />
  );
}

describe("VisaoGeralView", () => {
  afterEach(cleanup);

  it("mostra saudação, 4 indicadores e blocos", () => {
    render(viewDe(PROJETOS));
    expect(screen.getByRole("heading", { level: 1, name: "Bom dia" })).toBeTruthy();
    expect(screen.getByText(/Terça, 20 de outubro/)).toBeTruthy();
    for (const rotulo of ["Em andamento", "Prazo vencido", "Entregas em 7 dias", "Em revisão"]) {
      expect(screen.getAllByText(rotulo).length).toBeGreaterThan(0);
    }
    for (const bloco of ["Entregas por semana", "Carga por pessoa", "Agenda da semana", "Próximos prazos"]) {
      expect(screen.getByRole("heading", { name: bloco })).toBeTruthy();
    }
    expect(screen.getAllByText("Em breve")).toHaveLength(3);
    for (const area of ["Clientes e comercial", "Financeiro", "Campanhas"]) {
      expect(screen.getByRole("heading", { name: area })).toBeTruthy();
    }
  });

  it("indicadores mostram os números do resumo", () => {
    render(viewDe(PROJETOS));
    const kpi = (rotulo: string) => screen.getByTestId(`kpi-${rotulo}`);
    expect(within(kpi("andamento")).getByText("2")).toBeTruthy();
    expect(within(kpi("andamento")).getByText("de 5")).toBeTruthy();
    expect(within(kpi("andamento")).getByText("40% da carteira")).toBeTruthy();
    expect(within(kpi("vencido")).getByText("2")).toBeTruthy();
    expect(within(kpi("vencido")).getByText("O mais antigo há 3 dias")).toBeTruthy();
    expect(within(kpi("entregas")).getByText("2")).toBeTruthy();
    expect(within(kpi("entregas")).getByText("Próxima: amanhã · Padaria Trigo")).toBeTruthy();
    expect(within(kpi("revisao")).getByText("1")).toBeTruthy();
  });

  it("faixa de atenção aparece só com atrasados e linka para /painel/projetos", () => {
    const { unmount } = render(viewDe(PROJETOS));
    const faixa = screen.getByTestId("faixa-atencao");
    expect(faixa.textContent).toContain("2 projetos com prazo vencido");
    expect(faixa.textContent).toContain("Site institucional (3 dias)");
    expect(within(faixa).getByRole("link", { name: "Ver projetos" }).getAttribute("href")).toBe("/painel/projetos");
    unmount();

    render(viewDe(PROJETOS.filter((p) => p.nome !== "Site institucional")));
    expect(screen.getByTestId("faixa-atencao").textContent).toContain("1 projeto com prazo vencido");
    cleanup();

    render(viewDe(PROJETOS.filter((p) => !["Site institucional", "Sistema de agendamento"].includes(p.nome))));
    expect(screen.queryByTestId("faixa-atencao")).toBeNull();
    expect(screen.getByText("Nenhum projeto atrasado")).toBeTruthy();
  });

  it("rodapé de vencidos: singular, plural e mais de 3", () => {
    const atrasado = (nome: string, prazo: string) => projeto({ nome, prazo });
    const rodape = (projetos: Projeto[]) => {
      render(viewDe(projetos));
      const t = screen.getByTestId("kpi-vencido").textContent ?? "";
      cleanup();
      return t;
    };
    expect(rodape([atrasado("A", "2026-10-19")])).toContain("Atrasado há 1 dia");
    expect(rodape([atrasado("A", "2026-10-19")])).not.toContain("1 dias");
    expect(rodape([atrasado("A", "2026-10-19"), atrasado("B", "2026-10-19")])).toContain("O mais antigo há 1 dia");
    expect(rodape([atrasado("A", "2026-10-15"), atrasado("B", "2026-10-19")])).toContain("O mais antigo há 5 dias");
    const cinco = ["2026-10-19", "2026-10-18", "2026-10-10", "2026-10-17", "2026-10-16"].map((d, i) =>
      atrasado(`P${i}`, d),
    );
    expect(rodape(cinco)).toContain("O mais antigo há 10 dias");
  });

  it("sem projetos mostra a chamada para criar o primeiro", () => {
    render(viewDe([]));
    expect(screen.getByText("Nenhum projeto ainda.")).toBeTruthy();
    const link = screen.getByRole("link", { name: "Criar o primeiro projeto" });
    expect(link.getAttribute("href")).toBe("/painel/projetos?novo=1");
    expect(screen.getByRole("heading", { level: 1, name: "Bom dia" })).toBeTruthy();
    expect(screen.queryByTestId("faixa-atencao")).toBeNull();
  });

  it("Anel e barras nunca produzem NaN no DOM (snapshot de atributos sem 'NaN')", () => {
    for (const projetos of [[], [projeto({ nome: "Sem prazo", status: "concluido" })]]) {
      const { container, unmount } = render(viewDe(projetos));
      expect(container.innerHTML).not.toMatch(/NaN|Infinity|undefined/);
      unmount();
    }
    const { container } = render(viewDe([projeto({ nome: "Só pausado", status: "pausado" })]));
    expect(container.innerHTML).not.toMatch(/NaN|Infinity|undefined/);
    // um no indicador e outro no gráfico
    expect(screen.getAllByText("Nenhuma entrega prevista")).toHaveLength(2);
  });

  it("agenda destaca hoje e resume o excedente do dia", () => {
    const muitos = ["A", "B", "C", "D"].map((n) => projeto({ nome: `Proj ${n}`, prazo: "2026-10-22" }));
    render(viewDe(muitos));
    const hoje = screen.getByTestId("dia-hoje");
    expect(hoje.textContent).toContain("Hoje · Ter");
    expect(hoje.textContent).toContain("20");
    const dia = screen.getByTestId("dia-2026-10-22");
    expect(within(dia).getByText("Proj A")).toBeTruthy();
    expect(within(dia).getByText("+2")).toBeTruthy();
    expect(within(dia).queryByText("Proj C")).toBeNull();
  });
});

describe("/painel (visão geral)", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-20T13:00:00Z")); // 10h em São Paulo
    vi.mocked(useAcesso).mockReturnValue({ estado: "ok", papel: "membro", email: "a@b.com" });
    vi.mocked(listarProjetos).mockResolvedValue(PROJETOS);
    vi.mocked(listarEquipe).mockResolvedValue(EQUIPE);
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("carrega, mostra 'Carregando…' e depois o dashboard com a saudação de São Paulo", async () => {
    render(<PainelPage />);
    expect(screen.getByRole("status").textContent).toContain("Carregando…");
    expect(await screen.findByRole("heading", { level: 1, name: "Bom dia" })).toBeTruthy();
    expect(screen.getByText(/Terça, 20 de outubro/)).toBeTruthy();
    const main = screen.getByRole("main");
    expect(within(main).getAllByText("Em breve")).toHaveLength(3);
    expect(listarProjetos).toHaveBeenCalledTimes(1);
    expect(listarEquipe).toHaveBeenCalledTimes(1);
  });

  it("Novo projeto na barra superior aponta para /painel/projetos?novo=1", async () => {
    render(<PainelPage />);
    await screen.findByRole("heading", { level: 1, name: "Bom dia" });
    expect(screen.getByRole("link", { name: "Novo projeto" }).getAttribute("href")).toBe("/painel/projetos?novo=1");
  });

  it("falha ao carregar mostra alerta mapeado e Tentar novamente", async () => {
    vi.mocked(listarProjetos).mockRejectedValueOnce({ code: "42501" });
    render(<PainelPage />);
    const alerta = await screen.findByRole("alert");
    expect(alerta.textContent).toContain("Você não tem permissão para fazer isso.");
    expect(screen.queryByText("Nenhum projeto ainda.")).toBeNull();
    expect(screen.queryByTestId("kpi-andamento")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Bom dia" })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(listarProjetos).toHaveBeenCalledTimes(2);
  });

  it("falha só da equipe mantém o dashboard", async () => {
    vi.mocked(listarEquipe).mockRejectedValue(new Error("x"));
    render(<PainelPage />);
    expect(await screen.findByTestId("kpi-andamento")).toBeTruthy();
    expect(screen.getByText("Não foi possível carregar a equipe.")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("falha só da equipe: o cartão Carga por pessoa mostra só o aviso, sem 'Sem responsável' e sem linhas 'N projetos'", async () => {
    vi.mocked(listarEquipe).mockRejectedValue(new Error("x"));
    const { container } = render(<PainelPage />);
    await screen.findByTestId("kpi-andamento");
    expect(screen.getByText("Não foi possível carregar a equipe.")).toBeTruthy();
    expect(screen.queryByText("Sem responsável")).toBeNull();
    expect(screen.queryByText(/\d+ projetos?$/)).toBeNull();
    expect(container.querySelector(".pn-emp")).toBeNull();
    expect(screen.queryByText("Planejado e pausado")).toBeNull();
    expect(screen.getByRole("heading", { name: "Entregas por semana" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Agenda da semana" })).toBeTruthy();
    expect(screen.getByTestId("kpi-revisao")).toBeTruthy();
  });

  it("Tentar novamente volta a Carregando e ignora resposta da tentativa anterior", async () => {
    const primeira = deferido<Projeto[]>();
    const segunda = deferido<Projeto[]>();
    vi.mocked(listarProjetos)
      .mockReturnValueOnce(primeira.promessa)
      .mockReturnValueOnce(segunda.promessa);
    render(<PainelPage />);
    await act(async () => primeira.reject(new Error("falhou")));
    const tentar = await screen.findByRole("button", { name: "Tentar novamente" });
    fireEvent.click(tentar); // segunda requisição: volta a "Carregando…" e some o botão
    expect(screen.getByRole("status").textContent).toBe("Carregando…");
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).toBeNull();
    expect(listarProjetos).toHaveBeenCalledTimes(2);
    await act(async () => segunda.resolve(PROJETOS));
    expect(await screen.findByTestId("kpi-andamento")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(listarProjetos).toHaveBeenCalledTimes(2);
  });

  it("sem projetos no banco mostra a chamada de criar (só depois de carregar)", async () => {
    vi.mocked(listarProjetos).mockResolvedValue([]);
    render(<PainelPage />);
    expect(screen.queryByText("Nenhum projeto ainda.")).toBeNull();
    expect(await screen.findByText("Nenhum projeto ainda.")).toBeTruthy();
  });

  it("não atualiza estado depois de desmontar", async () => {
    const d = deferido<Projeto[]>();
    vi.mocked(listarProjetos).mockReturnValue(d.promessa);
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<PainelPage />);
    unmount();
    await act(async () => d.resolve(PROJETOS));
    expect(erro).not.toHaveBeenCalled();
    erro.mockRestore();
  });
});
