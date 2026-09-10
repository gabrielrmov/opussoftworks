"use client";

type ServiceCardProps = {
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
  "data-aos"?: string;
  "data-aos-delay"?: number;
};

export default function ServiceCard({
  tag,
  title,
  description,
  icon,
  index,
  "data-aos": dataAos,
  "data-aos-delay": dataAosDelay,
}: ServiceCardProps) {
  return (
    <a
      data-aos={dataAos}
      data-aos-delay={dataAosDelay}
      className="group/card relative flex h-full flex-col rounded-2xl bg-liquid-kelp p-9"
      href="#contato"
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-liquid-abyss text-liquid-mist transition-transform duration-300 group-hover/card:scale-110">
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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[rgba(3,81,75,0.5)] text-platinum transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5">
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
