import type { ReactNode } from "react";
import { SCRIPT_TEMA } from "@/lib/painel/tema";
import "./painel.css";

export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pn-raiz" data-tema="claro" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      {children}
    </div>
  );
}
