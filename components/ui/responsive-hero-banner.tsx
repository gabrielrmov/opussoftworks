"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import logoWhite from "@/public/images/elevion-logo-white.png";
import GlowCursor from "@/components/ui/glow-cursor";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Entrada escalonada (nav desce, depois badge/título/texto/botões sobem em
// sequência) — troquei o data-aos genérico por isso pra ter controle fino
// de stagger/easing, já que o resto do hero (GlowCursor) também usa motion.
const navVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

const contentContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const contentItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

interface NavLink {
  label: string;
  href: string;
}

interface ResponsiveHeroBannerProps {
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  navLinks?: NavLink[];
  /** O site já tem um <Header/> fixo global (components/ui/header.tsx).
   *  Esse nav flutuante é próprio deste hero (pra reproduzir a referência
   *  que o Gabriel mandou) — passe false se for embutir esse componente
   *  numa página que já renderiza o Header global, pra não duplicar
   *  navegação. */
  showNav?: boolean;
  className?: string;
}

const DEFAULT_WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero solicitar meu diagnóstico gratuito com a ELEVION.",
);

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Como trabalhamos", href: "#como-trabalhamos" },
  { label: "FAQ", href: "#faq" },
];

// Azul #2F8CFF — já usado pra "Tráfego pago" no manual de marca antigo da
// Elevion — no lugar do vermelho-fogo genérico da referência.
const ACCENT = "#2F8CFF";

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  description = "Uma operação só: tráfego que traz lead, sistema que organiza a venda, site que fecha negócio.",
  primaryButtonText = "Solicitar diagnóstico gratuito",
  primaryButtonHref = DEFAULT_WHATSAPP_URL,
  secondaryButtonText = "Ver serviços",
  secondaryButtonHref = "#servicos",
  navLinks = DEFAULT_NAV_LINKS,
  showNav = true,
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ background: "#0E0E13" }}
    >
      {/* streak de luz diagonal — linha fixa + brilho viajando por cima em
          loop (reaproveita o keyframe "shimmer" que já existia em
          app/css/style.css, sem componente nenhum usando até agora) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            left: "-15%",
            top: "10%",
            width: "150%",
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(47,140,255,0.85) 42%, #E3F0FF 50%, rgba(47,140,255,0.85) 58%, transparent 100%)",
            transform: "rotate(-13deg)",
            boxShadow: "0 0 70px 14px rgba(47,140,255,0.4)",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-shimmer"
            style={{
              position: "absolute",
              inset: 0,
              width: "40%",
              background:
                "linear-gradient(90deg, transparent 0%, #FFFFFF 50%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(47,140,255,0.12) 0%, transparent 55%)" }}
        />
      </div>

      {/* Trilha de luz que segue o cursor (React Bits — GlowCursor), com a
          cor da marca. Valores mais discretos que o padrão da lib — site
          institucional, não um showcase de efeito. */}
      <GlowCursor
        className="absolute inset-0"
        color={ACCENT}
        secondaryColor="#BFE0FF"
        trailLength={36}
        trailWidth={6}
        glowIntensity={1.4}
        opacity={0.85}
        brightness={1.1}
      />

      {showNav && (
        <motion.div
          className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-10"
          variants={navVariants}
          initial="hidden"
          animate="show"
        >
          <Image src={logoWhite} alt="ELEVION" className="h-6 w-auto" priority />

          <nav className="hidden items-center gap-1 rounded-full bg-white/5 px-1.5 py-1.5 ring-1 ring-white/10 backdrop-blur md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={primaryButtonHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-white"
              style={{ background: ACCENT }}
            >
              Quero meu diagnóstico
            </a>
          </nav>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? <path d="M6 6 L18 18 M6 18 L18 6" /> : <path d="M4 7 L20 7 M4 12 L20 12 M4 17 L20 17" />}
            </svg>
          </button>
        </motion.div>
      )}

      {showNav && mobileMenuOpen && (
        <div className="relative z-20 mx-6 mt-2 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <motion.div
        className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-6 py-16 text-center sm:px-10"
        variants={contentContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur"
          variants={contentItem}
        >
          <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-neutral-900">
            Grátis
          </span>
          <span className="text-sm font-medium text-white/90">Diagnóstico sem compromisso</span>
        </motion.div>

        <motion.h1
          className="max-w-3xl font-medium leading-tight tracking-tight text-white"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
          variants={contentItem}
        >
          Resultado não é sorte.
          <br />
          É{" "}
          <span
            className="animate-text-gradient bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${ACCENT} 0%, #FFFFFF 50%, ${ACCENT} 100%)`,
              backgroundSize: "200% auto",
            }}
          >
            entrega
          </span>
          .
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          variants={contentItem}
        >
          {description}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={contentItem}
        >
          <a
            href={primaryButtonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <span
              aria-hidden="true"
              className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)" }}
            />
            {primaryButtonText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href={secondaryButtonHref}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {secondaryButtonText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ResponsiveHeroBanner;
