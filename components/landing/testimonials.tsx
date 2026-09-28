import LetterGlitch from "@/components/ui/letter-glitch";

const testimonials = [
  {
    quote:
      "Antes, nossa equipe perdia muito tempo com processos manuais. Com a solução, conseguimos centralizar as informações e acompanhar tudo de forma muito mais organizada.",
    name: "Mariana Costa",
    role: "Gerente Administrativa",
    company: "Empresa de serviços, Goiânia, GO",
  },
  {
    quote:
      "O site trouxe uma apresentação muito mais profissional para a empresa e facilitou bastante o contato com novos clientes.",
    name: "Rafael Almeida",
    role: "Diretor Comercial",
    company: "Empresa de tecnologia, Goiânia, GO",
  },
  {
    quote:
      "A gente tinha dificuldade para organizar as informações do negócio e acompanhar as demandas. Depois da implementação, ficou muito mais fácil visualizar tudo e tomar decisões.",
    name: "Lucas Mendes",
    role: "Sócio-diretor",
    company: "Empresa de serviços, São Paulo, SP",
  },
  {
    quote:
      "Precisávamos de uma presença digital que realmente transmitisse o tamanho da nossa empresa. O novo site deixou nossa comunicação muito mais profissional.",
    name: "Camila Oliveira",
    role: "Coordenadora Comercial",
    company: "Empresa de engenharia, Curitiba, PR",
  },
  {
    quote:
      "O atendimento foi muito próximo desde o início. Entenderam o que a empresa precisava e transformaram isso em uma solução simples de usar no dia a dia.",
    name: "André Martins",
    role: "Diretor",
    company: "Empresa de construção, Belo Horizonte, MG",
  },
  {
    quote:
      "Começamos com uma necessidade específica e acabamos encontrando várias oportunidades de melhorar nossos processos. Hoje temos muito mais controle da operação.",
    name: "Felipe Rocha",
    role: "Gerente Operacional",
    company: "Empresa de locação, Goiânia, GO",
  },
  {
    quote:
      "A comunicação da nossa empresa mudou completamente. Ficou mais clara, mais moderna e muito mais alinhada com o público que queremos alcançar.",
    name: "Juliana Ferreira",
    role: "Marketing",
    company: "Empresa de tecnologia, Florianópolis, SC",
  },
  {
    quote:
      "Antes dependíamos de várias planilhas para controlar informações diferentes. Centralizar tudo em um único sistema tornou nossa rotina muito mais prática.",
    name: "Bruno Carvalho",
    role: "Administrador",
    company: "Empresa de distribuição, Brasília, DF",
  },
  {
    quote:
      "O projeto conseguiu unir uma aparência profissional com algo que realmente funciona para nossa operação. O resultado ficou acima do que imaginávamos.",
    name: "Renato Alves",
    role: "Sócio",
    company: "Empresa de comércio, Recife, PE",
  },
  {
    quote:
      "Hoje conseguimos acompanhar melhor nossos resultados e identificar problemas muito mais rápido. Foi uma mudança importante na forma como administramos a empresa.",
    name: "Patrícia Nunes",
    role: "Diretora Administrativa",
    company: "Empresa de serviços, Campinas, SP",
  },
];

const MARQUEE_STYLES = `
@keyframes testimonials-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.testimonials-marquee-track {
  animation: testimonials-marquee-scroll 65s linear infinite;
}
.testimonials-marquee-track:hover {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .testimonials-marquee-track {
    animation: none;
  }
}
`;

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="w-[300px] shrink-0 rounded-2xl bg-landing-card p-6 sm:w-[340px] sm:p-7">
      <p className="text-[15px] leading-relaxed text-landing-ink">{t.quote}</p>
      <p className="mt-5 text-[13px]">
        <span className="font-medium text-landing-ink">{t.name}</span>{" "}
        <span className="text-landing-muted">· {t.role}</span>
      </p>
      <p className="text-[13px] text-landing-muted">{t.company}</p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:px-11 sm:py-24">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_STYLES }} />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true">
        <LetterGlitch
          glitchColors={["#ff6039", "#ffb6a4", "#171717"]}
          glitchSpeed={60}
          smooth
          lightMode
          backgroundColor="transparent"
          outerVignette={false}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[960px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-intertight text-xs font-medium uppercase tracking-[0.14em] text-landing-accent">
            Quem trabalhou com a gente
          </p>
          <h2 className="mt-3 font-intertight text-2xl font-medium tracking-[-0.02em] text-landing-ink sm:text-[30px]">
            Depoimentos de clientes.
          </h2>
        </div>
      </div>

      <div className="relative z-10 mt-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="testimonials-marquee-track flex w-max gap-3">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
