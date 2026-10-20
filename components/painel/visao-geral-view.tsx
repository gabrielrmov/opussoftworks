import Link from "next/link";
import type { ReactNode } from "react";
import type { ResumoPainel } from "@/lib/painel/resumo";
import { textoRelativo } from "@/lib/painel/resumo";
import { Anel, BarrasSemanais, CargaPorPessoa } from "./graficos";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const EM_BREVE = [
  { nome: "Clientes e comercial", texto: "Funil de vendas e contratos. Próximo módulo." },
  { nome: "Financeiro", texto: "Receita, custos e mensalidades." },
  { nome: "Campanhas", texto: "Investimento e resultado dos clientes." },
];

function dataCurta(data: string): string {
  const [, mes, dia] = data.split("-").map(Number);
  return `${dia} ${MESES[mes - 1] ?? ""}`.trim();
}

function diaDoMes(data: string): string {
  return String(Number(data.split("-")[2]));
}

function dias(n: number): string {
  return n === 1 ? "1 dia" : `${n} dias`;
}

function listaE(itens: string[]): string {
  if (itens.length <= 1) return itens.join("");
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

function Indicador({
  id,
  rotulo,
  tag,
  numero,
  alerta,
  rodape,
}: {
  id: string;
  rotulo: string;
  tag?: ReactNode;
  numero: number;
  alerta?: boolean;
  rodape: ReactNode;
}) {
  return (
    <div className={`pn-cartao pn-kpi${alerta ? " pn-kpi-alerta" : ""}`} data-testid={`kpi-${id}`}>
      <div className="pn-kpi-r">
        <span>{rotulo}</span>
        {tag}
      </div>
      <div className="pn-kpi-n pn-num">{numero}</div>
      <div className="pn-kpi-rod">{rodape}</div>
    </div>
  );
}

function FaixaAtencao({ atrasados }: { atrasados: ResumoPainel["atrasados"] }) {
  const n = atrasados.length;
  const nomes = atrasados.slice(0, 2).map((p) => `${p.nome} (${dias(p.diasDeAtraso)})`);
  const resto = n - nomes.length;
  return (
    <div className="pn-atencao" data-testid="faixa-atencao">
      <span className="pn-atencao-ponto" aria-hidden="true" />
      <span>
        <b>{n === 1 ? "1 projeto com prazo vencido" : `${n} projetos com prazo vencido`}</b>
        {" · "}
        {listaE(resto > 0 ? [...nomes, `mais ${resto}`] : nomes)}
      </span>
      <Link href="/painel/projetos" className="pn-atencao-link">
        Ver projetos
      </Link>
    </div>
  );
}

function Agenda({ agenda }: { agenda: ResumoPainel["agendaSemana"] }) {
  const hoje = agenda.find((d) => d.hoje)?.data ?? "";
  return (
    <div className="pn-agenda">
      {agenda.map((d) => {
        const visiveis = d.projetos.slice(0, 2);
        const extra = d.projetos.length - visiveis.length;
        return (
          <div
            key={d.data}
            className={`pn-dia${d.hoje ? " pn-dia-hoje" : ""}`}
            data-testid={d.hoje ? "dia-hoje" : `dia-${d.data}`}
          >
            <span className="pn-dia-d">{d.hoje ? `Hoje · ${d.diaSemana}` : d.diaSemana}</span>
            <span className="pn-dia-n pn-num">{diaDoMes(d.data)}</span>
            {visiveis.map((p) => (
              <span key={p.id} className={`pn-ev${hoje && d.data < hoje ? " pn-ev-c" : ""}`}>
                {p.nome}
              </span>
            ))}
            {extra > 0 && <span className="pn-ev-mais">+{extra}</span>}
          </div>
        );
      })}
    </div>
  );
}

export function VisaoGeralView({
  resumo,
  saudacao,
  dataTexto,
  avisoEquipe,
}: {
  resumo: ResumoPainel;
  saudacao: string;
  dataTexto?: string;
  avisoEquipe?: string;
}) {
  const hoje = resumo.agendaSemana.find((d) => d.hoje)?.data ?? "";
  const vazio = resumo.total === 0;
  const fracao = resumo.total > 0 ? resumo.emAndamento / resumo.total : 0;
  const atrasos = resumo.atrasados.slice(0, 3).map((p) => p.diasDeAtraso);

  let rodapeVencido: string;
  if (atrasos.length === 0) rodapeVencido = "Nenhum projeto atrasado";
  else {
    const mais = resumo.atrasados.length - atrasos.length;
    const base = listaE(atrasos.map(String)) + (mais > 0 ? `, +${mais}` : "");
    rodapeVencido =
      atrasos.length === 1 && mais === 0
        ? `Atrasado há ${dias(atrasos[0])}`
        : `Atrasados há ${base} dias`;
  }

  const proxima = resumo.proximaEntrega;
  const rodapeEntregas =
    resumo.entregasEm7Dias > 0 && proxima && proxima.prazo
      ? `Próxima: ${textoRelativo(proxima.prazo, hoje)} · ${proxima.cliente}`
      : "Nenhuma entrega prevista";

  return (
    <>
      <div className="pn-cab">
        <div>
          <h1 className="pn-h1">{saudacao}</h1>
          <p className="pn-sub">
            {dataTexto ? `${dataTexto} · ` : ""}
            aqui está o que precisa da sua atenção
          </p>
        </div>
      </div>

      {vazio ? (
        <section className="pn-cartao pn-vazio">
          <h2 className="pn-tit">Nenhum projeto ainda.</h2>
          <p className="pn-nota">Cadastre o primeiro projeto para ver prazos, carga da equipe e a agenda da semana aqui.</p>
          <Link href="/painel/projetos?novo=1" className="pn-btn">
            Criar o primeiro projeto
          </Link>
        </section>
      ) : (
        <>
          {resumo.atrasados.length > 0 && <FaixaAtencao atrasados={resumo.atrasados} />}

          <div className="pn-kpis">
            <Indicador
              id="andamento"
              rotulo="Em andamento"
              tag={<span className="pn-tag">de {resumo.total}</span>}
              numero={resumo.emAndamento}
              rodape={
                <>
                  <Anel fracao={fracao} />
                  {`${Math.round(fracao * 100)}% da carteira`}
                </>
              }
            />
            <Indicador
              id="vencido"
              rotulo="Prazo vencido"
              alerta={resumo.atrasados.length > 0}
              tag={resumo.atrasados.length > 0 ? <span className="pn-tag pn-tag-c">atenção</span> : undefined}
              numero={resumo.atrasados.length}
              rodape={rodapeVencido}
            />
            <Indicador id="entregas" rotulo="Entregas em 7 dias" numero={resumo.entregasEm7Dias} rodape={rodapeEntregas} />
            <Indicador id="revisao" rotulo="Em revisão" numero={resumo.emRevisao} rodape="Aguardando validação" />
          </div>

          <div className="pn-g2">
            <section className="pn-cartao">
              <h2 className="pn-tit">Entregas por semana</h2>
              <p className="pn-nota">Quantos projetos vencem em cada semana. A atual está em coral.</p>
              <BarrasSemanais semanas={resumo.entregasPorSemana} />
            </section>
            <section className="pn-cartao">
              <h2 className="pn-tit">Carga por pessoa</h2>
              <p className="pn-nota">Projetos abertos de cada um, por status.</p>
              {avisoEquipe && <p className="pn-aviso-equipe">{avisoEquipe}</p>}
              <CargaPorPessoa pessoas={resumo.cargaPorPessoa} />
            </section>
          </div>

          <section className="pn-cartao pn-bloco">
            <h2 className="pn-tit">Agenda da semana</h2>
            <p className="pn-nota">Prazos de segunda a domingo.</p>
            <Agenda agenda={resumo.agendaSemana} />
          </section>

          <section className="pn-cartao pn-bloco">
            <h2 className="pn-tit">Próximos prazos</h2>
            <p className="pn-nota">Os atrasados primeiro, depois os mais próximos.</p>
            {resumo.proximosPrazos.length === 0 ? (
              <p className="pn-mudo">Nenhum prazo em aberto.</p>
            ) : (
              <ul className="pn-lista">
                {resumo.proximosPrazos.map(({ projeto, quando, atrasado }) => (
                  <li key={projeto.id}>
                    <div className="pn-lista-m">
                      <div className="pn-lista-nome">{projeto.nome}</div>
                      <div className="pn-lista-cli">{projeto.cliente}</div>
                    </div>
                    <div className={`pn-q${atrasado ? " pn-q-atr" : ""}`}>
                      {projeto.prazo ? `${dataCurta(projeto.prazo)} · ` : ""}
                      {quando}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="pn-g3">
            {EM_BREVE.map(({ nome, texto }) => (
              <section key={nome} className="pn-breve-c">
                <div className="pn-breve-t">
                  <h2>{nome}</h2>
                  <span className="pn-tag">Em breve</span>
                </div>
                {texto}
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}
