import type { ReactNode } from "react";

export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: { children: ReactNode }) {
  return <div className="font-intertight min-h-screen bg-[#FAFAFA] text-[#161616]">{children}</div>;
}
