"use client";

import { useRef } from "react";

type Accent = "violet" | "emerald" | "white";

const accentStyles: Record<
  Accent,
  {
    iconWrap: string;
    glowBefore: string;
    glowAfter: string;
    tag: string;
    link: string;
  }
> = {
  violet: {
    iconWrap:
      "bg-violet-500/10 text-violet-400 group-hover/card:bg-violet-500/20 group-hover/card:text-violet-300",
    glowBefore: "before:bg-violet-500/80",
    glowAfter: "after:bg-violet-500",
    tag: "text-violet-300",
    link: "text-violet-400",
  },
  emerald: {
    iconWrap:
      "bg-emerald-500/10 text-emerald-400 group-hover/card:bg-emerald-500/20 group-hover/card:text-emerald-300",
    glowBefore: "before:bg-emerald-500/80",
    glowAfter: "after:bg-emerald-500",
    tag: "text-emerald-300",
    link: "text-emerald-400",
  },
  white: {
    iconWrap:
      "bg-white/10 text-gray-100 group-hover/card:bg-white/20 group-hover/card:text-white",
    glowBefore: "before:bg-white/70",
    glowAfter: "after:bg-white/90",
    tag: "text-gray-300",
    link: "text-gray-200",
  },
};

type ServiceCardProps = {
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent?: Accent;
};

export default function ServiceCard({
  tag,
  title,
  description,
  icon,
  accent = "violet",
}: ServiceCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const styles = accentStyles[accent];

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const maxTilt = 7;
    el.style.setProperty("--tilt-x", `${(0.5 - py) * maxTilt}deg`);
    el.style.setProperty("--tilt-y", `${(px - 0.5) * maxTilt}deg`);
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <a
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px [transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))_scale(1)] transition-transform duration-200 ease-out will-change-transform hover:[transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))_scale(1.02)] before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 hover:after:opacity-20 group-hover:before:opacity-100 ${styles.glowBefore} ${styles.glowAfter}`}
      href="#contato"
    >
      <div className="relative z-20 flex h-full flex-col overflow-hidden rounded-[inherit] bg-gray-950 p-6 after:absolute after:inset-0 after:-z-10 after:bg-linear-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover/card:scale-110 ${styles.iconWrap}`}
        >
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
            {icon}
          </svg>
        </div>
        <span
          className={`mb-3 inline-flex w-fit rounded-full bg-gray-800/60 px-2.5 py-0.5 text-xs font-medium ${styles.tag}`}
        >
          {tag}
        </span>
        <h3 className="mb-2 font-nacelle text-lg font-semibold text-gray-100">
          {title}
        </h3>
        <p className="text-indigo-200/65">{description}</p>
        <span
          className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover/card:gap-2.5 group-hover/card:opacity-100 ${styles.link}`}
        >
          Saiba mais
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12 L19 12" />
            <path d="M13 6 L19 12 L13 18" />
          </svg>
        </span>
      </div>
    </a>
  );
}
