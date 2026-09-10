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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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

  return (
    <header className="sticky top-0 z-30 pt-4 md:pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Site branding */}
        <div className="flex flex-1">
          <Logo />
        </div>

        {/* Nav pill (desktop) */}
        <nav className="relative hidden shrink-0 items-center gap-1 rounded-full border border-gray-700/60 bg-gray-900/80 p-1.5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md md:flex">
          {/* Shine highlight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-px w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent blur-[1px]"
          />
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-100/10 text-gray-100"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA (desktop) */}
        <div className="hidden flex-1 items-center justify-end md:flex">
          <Link
            href="#contato"
            className="btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
          >
            Fale com a gente
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-gray-300 transition hover:text-gray-100 md:hidden"
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
        <div className="mx-auto mt-2 max-w-6xl px-4 sm:px-6 md:hidden">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/95 p-4 backdrop-blur-md">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800/60 hover:text-gray-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#contato"
                onClick={() => setMobileOpen(false)}
                className="btn-sm mt-2 bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-center text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
              >
                Fale com a gente
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
