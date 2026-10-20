// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Anel, BarrasSemanais, CargaPorPessoa } from "@/components/painel/graficos";
import type { ResumoPainel } from "@/lib/painel/resumo";

afterEach(cleanup);

const semanas = (totais: number[]): ResumoPainel["entregasPorSemana"] =>
  ["19 out", "26 out", "2 nov", "9 nov", "16 nov", "23 nov"].map((rotulo, i) => ({
    inicio: `2026-10-${19 + i}`,
    rotulo,
    total: totais[i],
    atual: i === 0,
  }));

describe("BarrasSemanais", () => {
  it("BarrasSemanais: aria-label lista as 6 semanas e totais", () => {
    render(<BarrasSemanais semanas={semanas([6, 4, 3, 2, 1, 0])} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("aria-label")).toBe(
      "Entregas por semana: 19 out: 6; 26 out: 4; 2 nov: 3; 9 nov: 2; 16 nov: 1; 23 nov: 0",
    );
  });

  it("BarrasSemanais: semana atual em coral (classe pn-barra-atual)", () => {
    const { container } = render(<BarrasSemanais semanas={semanas([6, 4, 3, 2, 1, 0])} />);
    const atuais = container.querySelectorAll(".pn-barra-atual");
    expect(atuais).toHaveLength(1);
    expect(container.querySelectorAll(".pn-barra").length).toBeGreaterThanOrEqual(5);
  });

  it("BarrasSemanais: tudo zero mostra 'Nenhuma entrega prevista' e não quebra", () => {
    const { container } = render(<BarrasSemanais semanas={semanas([0, 0, 0, 0, 0, 0])} />);
    expect(screen.getByText("Nenhuma entrega prevista")).toBeTruthy();
    expect(container.querySelectorAll(".pn-barra, .pn-barra-atual")).toHaveLength(0);
    expect(screen.getByText("26 out")).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it("BarrasSemanais: alturas ficam entre 0 e o máximo e nunca são negativas", () => {
    const { container } = render(<BarrasSemanais semanas={semanas([6, 3, 0, 1, 0, 2])} />);
    const alturas = Array.from(container.querySelectorAll("rect")).map((r) => Number(r.getAttribute("height")));
    expect(alturas.length).toBeGreaterThan(0);
    for (const h of alturas) expect(h).toBeGreaterThan(0);
    expect(Math.max(...alturas)).toBeLessThanOrEqual(130);
  });
});

describe("CargaPorPessoa", () => {
  const base = { emAndamento: 0, emRevisao: 0, outros: 0 };

  it("CargaPorPessoa: larguras proporcionais ao total da pessoa e sem NaN com total 0", () => {
    const { container } = render(
      <CargaPorPessoa
        pessoas={[
          { id: "1", nome: "Gabriel", emAndamento: 2, emRevisao: 1, outros: 1, total: 4 },
          { id: "2", nome: "Rafael", ...base, total: 0 },
        ]}
      />,
    );
    const barras = container.querySelectorAll(".pn-emp");
    const larguras = Array.from(barras[0].querySelectorAll("i")).map((i) => (i as HTMLElement).style.width);
    expect(larguras).toEqual(["50%", "25%", "25%"]);
    for (const i of Array.from(barras[1].querySelectorAll("i"))) {
      expect((i as HTMLElement).style.width).toBe("0%");
    }
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(screen.getByText("4 projetos")).toBeTruthy();
    expect(screen.getByText("0 projetos")).toBeTruthy();
    for (const t of ["Em andamento", "Em revisão", "Planejado e pausado"]) expect(screen.getByText(t)).toBeTruthy();
    expect(barras[0].getAttribute("aria-hidden")).toBe("true");
  });

  it("CargaPorPessoa: lista 'Sem responsável' quando existir", () => {
    render(
      <CargaPorPessoa
        pessoas={[
          { id: "1", nome: "Gabriel", emAndamento: 1, emRevisao: 0, outros: 0, total: 1 },
          { id: null, nome: "Sem responsável", emAndamento: 0, emRevisao: 0, outros: 1, total: 1 },
        ]}
      />,
    );
    expect(screen.getByText("Sem responsável")).toBeTruthy();
    expect(screen.getAllByText("1 projeto")).toHaveLength(2);
  });

  it("CargaPorPessoa: sem ninguém mostra mensagem neutra", () => {
    render(<CargaPorPessoa pessoas={[]} />);
    expect(screen.getByText("Nenhum projeto aberto com responsável.")).toBeTruthy();
  });
});

describe("Anel", () => {
  const arco = (c: HTMLElement) => c.querySelector("circle[data-arco]");

  it("Anel: fração fora de 0–1 é limitada", () => {
    const { container, rerender } = render(<Anel fracao={5} />);
    const cheio = arco(container)?.getAttribute("stroke-dasharray");
    expect(cheio).toBeTruthy();
    const [a, b] = (cheio as string).split(" ").map(Number);
    expect(a).toBeCloseTo(b, 1);
    rerender(<Anel fracao={-3} />);
    expect(arco(container)).toBeNull();
    rerender(<Anel fracao={Number.NaN} />);
    expect(arco(container)).toBeNull();
    rerender(<Anel fracao={0.5} />);
    const [m, t] = (arco(container)?.getAttribute("stroke-dasharray") as string).split(" ").map(Number);
    expect(m / t).toBeCloseTo(0.5, 2);
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
