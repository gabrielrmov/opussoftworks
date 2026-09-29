"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export interface GlowMenuItem {
  label: string;
  href: string;
  /** CSS gradient/background usado no glow de hover. */
  gradient?: string;
}

export interface GlowMenuProps extends React.HTMLAttributes<HTMLElement> {
  items: GlowMenuItem[];
  /** Classe do texto do link (permite trocar a cor conforme o tema do fundo). */
  linkClassName?: string;
}

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  hover: {
    opacity: 1,
    scale: 1.9,
    transition: {
      opacity: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.35, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const DEFAULT_GRADIENT =
  "radial-gradient(circle, rgba(255,96,57,0.14) 0%, rgba(255,96,57,0.05) 55%, rgba(255,96,57,0) 100%)";

/**
 * Nav de links com um glow suave que segue o hover — adaptado do padrão
 * "glow menu" pra usar links reais (âncora), sem ícone e sem dependência de
 * tema (a landing page é sempre clara), usando `motion/react` (já instalado
 * como `motion`) em vez de instalar `framer-motion` de novo.
 */
export const GlowMenu = React.forwardRef<HTMLElement, GlowMenuProps>(
  ({ className, items, linkClassName, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "group relative isolate rounded-full px-4 py-2 text-[13px] transition-colors duration-300",
              linkClassName ?? "text-landing-muted hover:text-landing-ink",
            )}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: item.gradient ?? DEFAULT_GRADIENT }}
              initial="initial"
              whileHover="hover"
              variants={glowVariants}
            />
            <span className="relative z-10">{item.label}</span>
          </a>
        ))}
      </nav>
    );
  },
);

GlowMenu.displayName = "GlowMenu";
