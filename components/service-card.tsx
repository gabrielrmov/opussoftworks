"use client";

import { useRef } from "react";

type ServiceCardProps = {
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function ServiceCard({
  tag,
  title,
  description,
  icon,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

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
      className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px [transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))_scale(1)] transition-transform duration-200 ease-out will-change-transform hover:[transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))_scale(1.02)] before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 hover:after:opacity-20 group-hover:before:opacity-100"
      href="#contato"
    >
      <div className="relative z-20 flex h-full flex-col overflow-hidden rounded-[inherit] bg-gray-950 p-6 after:absolute after:inset-0 after:-z-10 after:bg-linear-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-indigo-500/20 group-hover/card:text-indigo-300">
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
        <span className="mb-3 inline-flex w-fit rounded-full bg-gray-800/60 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
          {tag}
        </span>
        <h3 className="mb-2 font-nacelle text-lg font-semibold text-gray-100">
          {title}
        </h3>
        <p className="text-indigo-200/65">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition-all group-hover/card:gap-2.5 group-hover/card:opacity-100">
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
