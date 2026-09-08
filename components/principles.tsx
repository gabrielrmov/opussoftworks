import Image from "next/image";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";

const principles = [
  {
    title: "Entrega",
    description:
      "Prazos definidos e cumpridos. Cada etapa do projeto tem data, responsável e checkpoint — sem enrolação.",
    icon: (
      <>
        <path d="M12 3 L21 7.5 L21 16.5 L12 21 L3 16.5 L3 7.5 Z" />
        <path d="M3 7.5 L12 12 L21 7.5" />
        <path d="M12 12 L12 21" />
      </>
    ),
  },
  {
    title: "Responsabilidade",
    description:
      "Comunicação direta em cada etapa. Você sabe exatamente o que está sendo feito, por que e com que resultado esperado.",
    icon: (
      <>
        <path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z" />
        <path d="M8.5 12 L11 14.5 L16 9" />
      </>
    ),
  },
  {
    title: "Assertividade",
    description:
      "Decisões baseadas em dados, não em achismo. Cada ação tem um objetivo claro por trás.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export default function Principles() {
  return (
    <section className="relative" id="principios">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt=""
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
        aria-hidden="true"
      >
        <Image className="max-w-none" src={BlurredShape} width={760} height={668} alt="" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Nossos princípios
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              As bases de cada entrega
            </h2>
            <p className="text-lg text-indigo-200/65">
              Três compromissos que guiam qualquer projeto que a ELEVION
              assume — do primeiro contato ao relatório final.
            </p>
          </div>
          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-3 md:gap-x-10">
            {principles.map((principle) => (
              <article key={principle.title}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {principle.icon}
                  </svg>
                </div>
                <h3 className="mb-1 font-nacelle text-[1.0625rem] font-semibold text-gray-200">
                  {principle.title}
                </h3>
                <p className="text-indigo-200/65">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
