"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/ui/header";

// Rotas onde o hero (ou outra seção) já traz o próprio nav — o Header
// fixo global duplicaria a navegação, então some aqui. "/" usa match exato
// (senão o startsWith("/") esconderia o header em todas as rotas): a home
// agora é a landing page pronta (a partir do PDF do usuário), que já vem
// com seu próprio SiteHeader claro.
const HIDE_HEADER_ON_EXACT = ["/"];
const HIDE_HEADER_ON_PREFIX = ["/hero-banner-preview"];

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (
    pathname &&
    (HIDE_HEADER_ON_EXACT.includes(pathname) ||
      HIDE_HEADER_ON_PREFIX.some((path) => pathname.startsWith(path)))
  ) {
    return null;
  }

  return <Header />;
}
