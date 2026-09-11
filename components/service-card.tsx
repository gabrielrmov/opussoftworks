"use client";

import { useRef } from "react";

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
  glowRgb?: string;
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
  glowRgb = "79,216,255",
  "data-aos": dataAos,
  "data-aos-delay": dataAosDelay,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const baseDelay = typeof dataAosDelay === "number" ? dataAosDelay : 0;
  const iconDelay = baseDelay + 150;
  const titleDelay = baseDelay + 250;
  const descDelay = baseDelay + 350;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - py) * 10;
    const rotateY = (px - 0.5) * 10;

    card.style.setProperty("--spot-x", `${px * 100}%`);
    card.style.setProperty("--spot-y", `${py * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  return (
    <a
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-aos={dataAos}
      data-aos-delay={dataAosDelay}
      style={{ transition: "transform 200ms ease-out" }}
      className={`group/card relative flex h-full flex-col overflow-hidden rounded-2xl bg-liquid-kelp p-9 transition-shadow duration-300 ease-out will-change-transform ${accentShadow}`}
      href="#contato"
    >
      {/* Spotlight que segue o cursor */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(480px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(${glowRgb}, 0.14), transparent 70%)`,
        }}
      />

      {/* Brilho difuso + barra de destaque no topo, cresce da esquerda no hover */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-3 -translate-y-1/2 scale-x-0 opacity-0 blur-md transition-all duration-500 ease-out group-hover/card:scale-x-100 group-hover/card:opacity-70 ${accentBar}`}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover/card:scale-x-100 ${accentBar}`}
      />

      <div className="relative mb-6 flex items-start justify-between">
        <div className="relative">
          {/* Halo pulsante atrás do ícone */}
          <span
            aria-hidden="true"
            className={`absolute inset-0 scale-150 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover/card:opacity-90 ${accentBg}`}
          />
          <div
            data-aos="zoom-in"
            data-aos-delay={iconDelay}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover/card:-rotate-6 group-hover/card:scale-110 ${accentBg} ${accentText}`}
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
        </div>

        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover/card:translate-x-1 group-hover/card:-translate-y-1 group-hover/card:scale-110">
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-white/10 transition-opacity duration-300 group-hover/card:opacity-0"
          />
          <span
            aria-hidden="true"
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 ${accentBg}`}
          />
          <svg
            className="relative z-10 text-platinum"
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
          className="relative mb-2 text-xs font-medium uppercase tracking-[0.1em] text-silver-mist transition-transform duration-300 group-hover/card:translate-x-1"
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
    </a>
  );
}
