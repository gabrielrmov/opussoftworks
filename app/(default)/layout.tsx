"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import AOS from "aos";
import "aos/dist/aos.css";

import Footer from "@/components/ui/footer";
import WhatsappFab from "@/components/ui/whatsapp-fab";
import BackToTop from "@/components/ui/back-to-top";

// A home ("/") é a landing page pronta (a partir do PDF do usuário) e já
// traz seu próprio SiteFooter claro — o Footer escuro global duplicaria.
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingHome = pathname === "/";

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  return (
    <>
      <main className="relative flex grow flex-col">{children}</main>

      {!isLandingHome && <Footer />}
      <WhatsappFab />
      <BackToTop />
    </>
  );
}
