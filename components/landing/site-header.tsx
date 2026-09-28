"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlack from "@/public/images/opus-logo-black.png";
import logoWhite from "@/public/images/opus-logo-white.png";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { GlowMenu } from "@/components/ui/glow-menu";

const navLinks = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#como-trabalhamos", label: "Método" },
  { href: "#faq", label: "Perguntas frequentes" },
];

// Trechos escuros do site (fundo do GlyphPortal e do footer cinemático) onde
// o header flutuante precisa trocar pra versão clara, senão o texto cinza
// fica ilegível em cima do fundo escuro. Cada marcador tem um id colocado no
// page.tsx exatamente na fronteira entre um fundo claro e um escuro.
const THEME_MARKERS = [
  { id: "header-theme-dark-1", dark: true },
  { id: "header-theme-light-1", dark: false },
  { id: "header-theme-dark-2", dark: true },
];

const WHATSAPP_URL = getWhatsAppUrl("Olá! Quero falar com um especialista da OPUS SOFTWORKS.");

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const boundariesRef = useRef<{ y: number; dark: boolean }[]>([]);

  // Enquanto o menu mobile está aberto: trava o scroll da página (comum em
  // menus fullscreen no celular, evita "scroll fantasma" atrás do menu) e
  // marca o body com uma classe que os botões flutuantes (WhatsApp, voltar
  // ao topo) já esperavam pra se esconder, mas que nunca era de fato aplicada.
  useEffect(() => {
    if (!open) return;
    const { style } = document.body;
    const previousOverflow = style.overflow;
    document.body.classList.add("mobile-menu-open");
    style.overflow = "hidden";
    return () => {
      document.body.classList.remove("mobile-menu-open");
      style.overflow = previousOverflow;
    };
  }, [open]);

  // Fecha o menu automaticamente se a tela for alargada (ex: girar o celular
  // pra paisagem ou abrir em uma janela maior) pra evitar o dropdown mobile
  // ficar aberto por engano em um layout que já mostra o menu desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const HEADER_OFFSET = 76; // altura aproximada do header flutuante + margem

    const computeBoundaries = () => {
      // Um marcador só é válido se já estiver posicionado bem abaixo da
      // primeira tela — enquanto a página ainda está montando (fontes/
      // imagens carregando, seções com WebGL ainda medindo altura), a
      // posição pode vir subestimada e, se ficasse pequena, faria o header
      // "pensar" que já passou por um trecho escuro logo no topo do site.
      // Ignoramos qualquer marcador cuja medição venha suspeita e mantemos
      // o valor anterior (ou Infinity) até a próxima recomputação.
      const minY = window.innerHeight;
      boundariesRef.current = THEME_MARKERS.map((marker, i) => {
        const el = document.getElementById(marker.id);
        const rawTop = el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
        const previous = boundariesRef.current[i];
        const top = rawTop >= minY ? rawTop : previous?.y !== undefined && previous.y !== Infinity ? previous.y + HEADER_OFFSET : Infinity;
        return { y: top - HEADER_OFFSET, dark: marker.dark };
      });
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // No topo da página estamos garantidamente na Hero (fundo claro) —
        // não depende de nenhum marcador, então força claro aqui.
        let dark = y > 8;
        if (dark) {
          dark = false;
          for (const boundary of boundariesRef.current) {
            if (y >= boundary.y) dark = boundary.dark;
          }
        }
        setIsDark(dark);
        ticking = false;
      });
    };

    computeBoundaries();
    handleScroll();

    // Recalcula algumas vezes logo após o carregamento (fontes, imagens e
    // seções com canvas/WebGL podem alterar a altura da página depois do
    // primeiro cálculo) e também quando a fonte customizada terminar de
    // carregar.
    const recomputeTimers = [100, 500, 1200, 2500].map((ms) =>
      window.setTimeout(() => {
        computeBoundaries();
        handleScroll();
      }, ms),
    );
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        computeBoundaries();
        handleScroll();
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", computeBoundaries);

    return () => {
      recomputeTimers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", computeBoundaries);
    };
  }, []);

  return (
    <header className="fixed left-1/2 top-3 z-30 w-full max-w-[960px] -translate-x-1/2 px-4 sm:top-4 sm:px-6">
      <div
        className={`relative flex h-[60px] items-center justify-between gap-4 rounded-full px-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 sm:px-7 ${
          isDark
            ? "border border-white/15 bg-white/10"
            : "border border-landing-ink/10 bg-landing-bg/40"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="OPUS SOFTWORKS">
          <Image
            src={isDark ? logoWhite : logoBlack}
            alt="OPUS SOFTWORKS"
            className="h-6 w-auto transition-opacity duration-500"
            priority
          />
        </Link>

        <GlowMenu
          items={navLinks}
          linkClassName={isDark ? "text-white/70 hover:text-white" : "text-landing-muted hover:text-landing-ink"}
          className="absolute left-1/2 hidden -translate-x-1/2 lg:flex"
        />

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-landing-accent px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Entrar em contato
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className={`-mr-1 flex h-11 w-11 items-center justify-center transition-colors duration-500 lg:hidden ${
            isDark ? "text-white" : "text-landing-ink"
          }`}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6 L18 18 M6 18 L18 6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7 L20 7 M4 12 L20 12 M4 17 L20 17" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="mt-2 rounded-2xl border border-landing-ink/10 bg-landing-bg px-6 py-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-landing-muted transition-colors hover:bg-landing-ink/5 hover:text-landing-ink active:bg-landing-ink/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-landing-accent px-5 py-3 text-sm font-medium text-white"
            >
              Entrar em contato
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
