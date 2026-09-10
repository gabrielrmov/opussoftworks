"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./logo";

const navLinks = [
  { href: "#sobre", id: "sobre", label: "Sobre" },
  { href: "#servicos", id: "servicos", label: "Serviços" },
  { href: "#como-trabalhamos", id: "como-trabalhamos", label: "Como trabalhamos" },
  { href: "#faq", id: "faq", label: "FAQ" },
];

const WHATSAPP_URL = `https://wa.me/5562994106910?text=${encodeURIComponent(
  "Olá! Quero saber mais sobre a ELEVION.",
)}`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-liquid-abyss/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Site branding */}
        <div className="flex flex-1">
          <Logo />
        </div>

        {/* Nav links (desktop) — centered independently of logo/CTA width */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-2 text-xs font-medium uppercase tracking-[0.12em] transition"
              >
                <span
                  className={
                    isActive
                      ? "text-platinum"
                      : "text-silver-mist transition-colors group-hover:text-platinum"
                  }
                >
                  {link.label}
                </span>
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px bg-liquid-mist transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* CTA (desktop) */}
        <div className="hidden flex-1 items-center justify-end md:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bioluminescent rounded-md px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#0a1414] transition-opacity hover:opacity-90"
          >
            Fale com a gente
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-silver-mist transition hover:text-platinum md:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6 L18 18 M6 18 L18 6" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7 L20 7 M4 12 L20 12 M4 17 L20 17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-6xl px-4 pb-4 sm:px-6 md:hidden">
          <div className="rounded-2xl bg-liquid-kelp p-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-silver-mist transition hover:bg-liquid-abyss hover:text-platinum"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="bg-bioluminescent mt-2 rounded-md px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.1em] text-[#0a1414]"
              >
                Fale com a gente
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
