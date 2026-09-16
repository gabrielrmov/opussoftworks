import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/elevion-logo-black.png";

const columns = [
  {
    title: "Soluções",
    links: [
      { label: "Tráfego pago", href: "#solucoes" },
      { label: "Sistemas e automações", href: "#solucoes" },
      { label: "Sites que convertem", href: "#solucoes" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Método", href: "#como-trabalhamos" },
      { label: "Cases", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Preços", href: "/precos" },
      { label: "Documentos", href: "/documentos" },
      { label: "Blog", href: "/blog" },
      { label: "Perguntas frequentes", href: "#faq" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-landing-ink/10 bg-landing-bg">
      <div className="mx-auto max-w-[960px] px-6 py-14 sm:px-11 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image src={logo} alt="ELEVION" className="h-6 w-auto" />
            <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-landing-muted">
              Tráfego, sistemas e sites sob uma mesma estratégia.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-medium text-landing-ink">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-landing-muted transition-colors hover:text-landing-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-landing-muted">© 2026 Elevion</p>
      </div>
    </footer>
  );
}
