"use client";

type ServiceCardProps = {
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
  accentBg?: string;
  accentText?: string;
  accentBar?: string;
  accentShadow?: string;
  "data-aos"?: string;
  "data-aos-delay"?: number;
};

export default function ServiceCard({
  tag,
  title,
  description,
  icon,
  index,
  accentBg = "bg-liquid-abyss",
  accentText = "text-liquid-mist",
  accentBar = "bg-liquid-mist",
  accentShadow = "hover:shadow-[0_25px_60px_-20px_rgba(79,216,255,0.45)]",
  "data-aos": dataAos,
  "data-aos-delay": dataAosDelay,
}: ServiceCardProps) {
  const iconDelay =
    typeof dataAosDelay === "number" ? dataAosDelay + 150 : undefined;

  return (
    <a
      data-aos={dataAos}
      data-aos-delay={dataAosDelay}
      className={`group/card relative flex h-full flex-col overflow-hidden rounded-2xl bg-liquid-kelp p-9 transition-all duration-300 hover:-translate-y-1.5 ${accentShadow}`}
      href="#contato"
    >
      {/* Barra de destaque no topo, cresce da esquerda no hover */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover/card:scale-x-100 ${accentBar}`}
      />

      <div className="mb-6 flex items-start justify-between">
        <div
          data-aos="zoom-in"
          data-aos-delay={iconDelay}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover/card:-rotate-6 group-hover/card:scale-110 ${accentBg} ${accentText}`}
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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-platinum transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:bg-white/20">
          <svg
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
        <span className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-silver-mist">
          0{index + 1} — {tag}
        </span>
      )}
      <h3 className="mb-2 font-nacelle text-lg font-medium text-platinum">
        {title}
      </h3>
      <p className="text-silver-mist">{description}</p>
    </a>
  );
}
