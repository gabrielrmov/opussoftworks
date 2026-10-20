import type { ResumoPainel } from "@/lib/painel/resumo";

function limitar(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return Math.min(1, Math.max(0, valor));
}

function porcentagem(fracao: number): string {
  return `${+(limitar(fracao) * 100).toFixed(2)}%`;
}

const BASE = 149;
const ALTURA_MAX = 130;
const LARGURA_BARRA = 58;

export function BarrasSemanais({ semanas }: { semanas: ResumoPainel["entregasPorSemana"] }) {
  const totais = semanas.map((s) => (Number.isFinite(s.total) ? Math.max(0, s.total) : 0));
  const maximo = Math.max(0, ...totais);
  const vazio = maximo === 0;
  const passo = 560 / Math.max(1, semanas.length);
  const descricao = `Entregas por semana: ${semanas.map((s, i) => `${s.rotulo}: ${totais[i]}`).join("; ")}`;

  return (
    <div className="pn-barras" role="img" aria-label={descricao}>
      <div className="pn-barras-valores" style={{ gridTemplateColumns: `repeat(${semanas.length}, 1fr)` }}>
        {semanas.map((s, i) => (
          <span key={s.inicio} className={s.atual ? "pn-barras-atual" : undefined}>
            {vazio ? "" : totais[i]}
          </span>
        ))}
      </div>
      <div className="pn-barras-area">
        <svg className="pn-graf" viewBox="0 0 560 150" focusable="false">
          <line x1="0" y1={BASE} x2="560" y2={BASE} />
          <line x1="0" y1="100" x2="560" y2="100" strokeDasharray="3 5" />
          <line x1="0" y1="50" x2="560" y2="50" strokeDasharray="3 5" />
          {!vazio &&
            semanas.map((s, i) => {
              if (totais[i] === 0) return null;
              const altura = Math.max(4, limitar(totais[i] / maximo) * ALTURA_MAX);
              return (
                <rect
                  key={s.inicio}
                  className={s.atual ? "pn-barra pn-barra-atual" : "pn-barra"}
                  x={i * passo + (passo - LARGURA_BARRA) / 2}
                  y={BASE - altura}
                  width={LARGURA_BARRA}
                  height={altura}
                  rx="8"
                />
              );
            })}
        </svg>
        {vazio && <p className="pn-barras-vazio">Nenhuma entrega prevista</p>}
      </div>
      <div className="pn-barras-rotulos" style={{ gridTemplateColumns: `repeat(${semanas.length}, 1fr)` }}>
        {semanas.map((s) => (
          <span key={s.inicio}>{s.rotulo}</span>
        ))}
      </div>
    </div>
  );
}

export function CargaPorPessoa({ pessoas }: { pessoas: ResumoPainel["cargaPorPessoa"] }) {
  return (
    <div>
      {pessoas.length === 0 ? (
        <p className="pn-mudo">Nenhum projeto aberto com responsável.</p>
      ) : (
        pessoas.map((p, i) => {
          const divisor = p.total > 0 ? p.total : 1;
          return (
            <div className="pn-pessoa" key={p.id ?? "sem-responsavel"}>
              <div className="pn-pessoa-l">
                <span className={`pn-av pn-av-p${i > 0 ? " pn-av-g" : ""}`} aria-hidden="true">
                  {p.id === null ? "–" : p.nome.charAt(0).toUpperCase()}
                </span>
                <span>{p.nome}</span>
                <span className="pn-num pn-pessoa-n">{p.total === 1 ? "1 projeto" : `${p.total} projetos`}</span>
              </div>
              <div className="pn-emp" aria-hidden="true">
                <i className="pn-emp-a" style={{ width: porcentagem(p.emAndamento / divisor) }} />
                <i className="pn-emp-r" style={{ width: porcentagem(p.emRevisao / divisor) }} />
                <i className="pn-emp-p" style={{ width: porcentagem(p.outros / divisor) }} />
              </div>
            </div>
          );
        })
      )}
      <div className="pn-leg">
        <span>
          <i className="pn-leg-a" aria-hidden="true" />
          Em andamento
        </span>
        <span>
          <i className="pn-leg-r" aria-hidden="true" />
          Em revisão
        </span>
        <span>
          <i className="pn-leg-p" aria-hidden="true" />
          Planejado e pausado
        </span>
      </div>
    </div>
  );
}

const RAIO = 14;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export function Anel({ fracao }: { fracao: number }) {
  const f = limitar(fracao);
  return (
    <svg className="pn-anel" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <circle cx="18" cy="18" r={RAIO} fill="none" stroke="var(--pn-trilho)" strokeWidth="5" />
      {f > 0 && (
        <circle
          data-arco=""
          cx="18"
          cy="18"
          r={RAIO}
          fill="none"
          stroke="var(--pn-coral)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${(f * CIRCUNFERENCIA).toFixed(2)} ${CIRCUNFERENCIA.toFixed(2)}`}
          transform="rotate(-90 18 18)"
        />
      )}
    </svg>
  );
}
