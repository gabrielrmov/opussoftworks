import Logo from "./logo";
import { WHATSAPP_DISPLAY, getWhatsAppUrl } from "@/lib/whatsapp";

const FOOTER_WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero solicitar meu diagnóstico gratuito com a OPUS SOFTWORKS.",
);

export default function Footer() {
  return (
    <footer className="bg-liquid-deep">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 justify-between gap-12 py-16 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-24 lg:grid-cols-[repeat(3,minmax(0,140px))_1fr] lg:grid-rows-1 xl:gap-20">
          {/* Serviços */}
          <div className="space-y-3" data-aos="fade-up">
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-slate-deep">
              Serviços
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#servicos"
                >
                  Tráfego pago
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#servicos"
                >
                  Sistemas de gestão
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#servicos"
                >
                  Sites para empresas
                </a>
              </li>
            </ul>
          </div>
          {/* Empresa */}
          <div className="space-y-3" data-aos="fade-up" data-aos-delay={80}>
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-slate-deep">
              Empresa
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#sobre"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#principios"
                >
                  Princípios
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#como-trabalhamos"
                >
                  Como trabalhamos
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#garantias"
                >
                  Garantias
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#faq"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href="#contato"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>
          {/* Contato */}
          <div className="space-y-3" data-aos="fade-up" data-aos-delay={160}>
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-slate-deep">
              Contato
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="inline-block text-silver-mist transition-all duration-200 hover:translate-x-1 hover:text-platinum"
                  href={FOOTER_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="text-silver-mist">Goiânia, GO</li>
            </ul>
          </div>
          {/* Brand + social */}
          <div
            className="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right"
            data-aos="fade-up"
            data-aos-delay={240}
          >
            <div className="mb-3 lg:flex lg:justify-end">
              <Logo />
            </div>
            <div className="text-sm">
              <p className="mb-3 text-silver-mist">
                © 2026 OPUS SOFTWORKS. Todos os direitos reservados.
              </p>
              <ul className="inline-flex gap-3 lg:justify-end">
                <li>
                  <a
                    className="flex items-center justify-center text-silver-mist transition-all duration-300 hover:scale-105 hover:text-platinum"
                    href={FOOTER_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 20 L5.2 16.2 A8 8 0 1 1 8 18.6 Z" />
                      <path d="M9 10c0 2.5 2.5 5 5 5" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
