import PixelCard from "@/components/ui/pixel-card";

type ServiceCardProps = {
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
  accentBg?: string;
  accentText?: string;
  accentBar?: string;
  "data-aos"?: string;
  "data-aos-delay"?: number;
};

export default function ServiceCard({
  tag,
  title,
  description,
  icon,
  index,
  accentBg = "bg-obsidian-button",
  accentText = "text-ivory-text",
  accentBar = "bg-mist-border/30",
  "data-aos": dataAos,
  "data-aos-delay": dataAosDelay,
}: ServiceCardProps) {
  const baseDelay = typeof dataAosDelay === "number" ? dataAosDelay : 0;
  const iconDelay = baseDelay + 150;
  const titleDelay = baseDelay + 250;
  const descDelay = baseDelay + 350;

  return (
    <a
      data-aos={dataAos}
      data-aos-delay={dataAosDelay}
      className="group/card relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cobalt/30 hover:bg-white/[0.07]"
      href="#contato"
    >
      {/* Pixels da marca "acendem" no hover/foco, atrás do conteúdo —
          React Bits PixelCard, cores trocadas pro azul da Elevion. */}
      <PixelCard noFocus className="flex h-full flex-col p-9">
      {/* Barra de destaque no topo, cresce da esquerda no hover */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover/card:scale-x-100 ${accentBar}`}
      />

      <div className="relative mb-6 flex items-start justify-between">
        <div
          data-aos="zoom-in"
          data-aos-delay={iconDelay}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover/card:scale-105 ${accentBg} ${accentText}`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 transition-transform duration-300 ease-out group-hover/card:translate-x-1 group-hover/card:-translate-y-1">
          <svg
            className="text-silver-mist transition-colors duration-300 group-hover/card:text-platinum"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 L17 7 M9 7 L17 7 L17 15" />
          </svg>
        </div>
      </div>

      {typeof index === "number" && (
        <span
          data-aos="fade-up"
          data-aos-delay={titleDelay}
          className="font-mono-brand relative mb-2 text-xs font-medium uppercase tracking-[0.1em] text-silver-mist transition-transform duration-300 group-hover/card:translate-x-1"
        >
          0{index + 1} — {tag}
        </span>
      )}
      <h3
        data-aos="fade-up"
        data-aos-delay={titleDelay}
        className="relative mb-2 font-nacelle text-lg font-medium text-platinum transition-transform duration-300 group-hover/card:translate-x-1"
      >
        {title}
      </h3>
      <p
        data-aos="fade-up"
        data-aos-delay={descDelay}
        className="relative text-silver-mist"
      >
        {description}
      </p>
      </PixelCard>
    </a>
  );
}
