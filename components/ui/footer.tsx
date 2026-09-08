import Logo from "./logo";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer illustration */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt=""
          />
        </div>
        <div className="grid grid-cols-2 justify-between gap-12 py-8 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-12 lg:grid-cols-[repeat(3,minmax(0,140px))_1fr] lg:grid-rows-1 xl:gap-20">
          {/* Serviços */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#servicos"
                >
                  Tráfego pago
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#servicos"
                >
                  Sistemas de gestão
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#servicos"
                >
                  Sites para empresas
                </a>
              </li>
            </ul>
          </div>
          {/* Empresa */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#principios"
                >
                  Princípios
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#como-trabalhamos"
                >
                  Como trabalhamos
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#contato"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>
          {/* Contato */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-indigo-200/65">[SEU E-MAIL]</li>
              <li className="text-indigo-200/65">[SEU TELEFONE / WHATSAPP]</li>
              <li className="text-indigo-200/65">[SUA CIDADE, UF]</li>
            </ul>
          </div>
          {/* Brand + social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right">
            <div className="mb-3 lg:flex lg:justify-end">
              <Logo />
            </div>
            <div className="text-sm">
              <p className="mb-3 text-indigo-200/65">
                © 2026 ELEVION. Todos os direitos reservados.
              </p>
              <ul className="inline-flex gap-3 lg:justify-end">
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="#"
                    aria-label="Instagram"
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="#"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M7.5 10.5 V17" />
                      <circle cx="7.5" cy="7.3" r="0.9" fill="currentColor" stroke="none" />
                      <path d="M11.5 17 V13.2c0-1.3.9-2.2 2.1-2.2 1.2 0 1.9.8 1.9 2.2V17" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="#"
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
