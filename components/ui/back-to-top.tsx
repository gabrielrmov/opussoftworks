"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Botão flutuante de "voltar ao topo". Só aparece a partir da seção de
 * Perguntas frequentes (#faq) em diante — antes disso fica escondido.
 * Fica empilhado em cima do botão de WhatsApp, no mesmo canto.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const triggerYRef = useRef(0);

  useEffect(() => {
    const faqEl = document.getElementById("faq");
    if (!faqEl) return;

    const HEADER_OFFSET = 72; // altura do header fixo

    const computeTrigger = () => {
      const rect = faqEl.getBoundingClientRect();
      triggerYRef.current = rect.top + window.scrollY - HEADER_OFFSET;
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY >= triggerYRef.current);
        ticking = false;
      });
    };

    computeTrigger();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", computeTrigger);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", computeTrigger);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-landing-ink text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-110 active:scale-95 sm:bottom-28 sm:right-8 [.mobile-menu-open_&]:pointer-events-none [.mobile-menu-open_&]:opacity-0 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
