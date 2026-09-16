"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CSSProperties, ElementType, MouseEvent } from "react";

/**
 * Lettering cinético (inspirado no site da Aerolab): cada letra reage à
 * proximidade do cursor, levantando/ampliando e ganhando um tom de destaque.
 * Implementado via CSS custom properties (--kt por letra) pra não re-renderizar
 * React a cada mousemove — mesmo padrão de manipulação direta do DOM já usado
 * no spotlight/tilt do ServiceCard.
 */

type Segment = {
  text: string;
  className?: string;
};

type KineticTextProps = {
  text?: string;
  segments?: Segment[];
  as?: ElementType;
  className?: string;
  /** raio de influência do cursor, em px */
  radius?: number;
  /** deslocamento vertical máximo de cada letra, em px */
  lift?: number;
  /** escala extra máxima aplicada a cada letra */
  scale?: number;
  /** cor pra qual a letra tende quando o cursor está bem em cima */
  color?: string;
} & Record<string, unknown>;

export default function KineticText({
  text,
  segments,
  as: Tag = "span",
  className = "",
  radius = 85,
  lift = 10,
  scale = 0.16,
  color = "var(--color-liquid-mist)",
  ...rest
}: KineticTextProps) {
  const resolvedSegments = useMemo<Segment[]>(
    () => segments ?? [{ text: text ?? "" }],
    [segments, text],
  );
  const fullText = useMemo(
    () => resolvedSegments.map((segment) => segment.text).join(""),
    [resolvedSegments],
  );

  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    enabledRef.current = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const applyEffect = useCallback(() => {
    rafRef.current = null;
    const pointer = pointerRef.current;
    for (const el of lettersRef.current) {
      if (!el) continue;
      if (!pointer) {
        el.style.setProperty("--kt", "0");
        continue;
      }
      const rect = el.getBoundingClientRect();
      const dx = pointer.x - (rect.left + rect.width / 2);
      const dy = pointer.y - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.max(0, 1 - dist / radius);
      el.style.setProperty("--kt", (strength * strength).toFixed(3));
    }
  }, [radius]);

  const schedule = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(applyEffect);
    }
  }, [applyEffect]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabledRef.current) return;
      pointerRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    },
    [schedule],
  );

  const handleMouseLeave = useCallback(() => {
    pointerRef.current = null;
    schedule();
  }, [schedule]);

  lettersRef.current = [];
  let letterIndex = 0;

  return (
    <Tag className={className} aria-label={fullText} {...rest}>
      <span
        aria-hidden="true"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          {
            "--kt-lift": `${-lift}px`,
            "--kt-scale": scale,
            "--kt-color": color,
          } as CSSProperties
        }
      >
        {resolvedSegments.map((segment, segIndex) =>
          // Divide em palavras/espaços preservando os espaços como texto real
          // (não como span) — é isso que dá ao navegador um ponto de quebra de
          // linha válido. Cada palavra vira um bloco atômico só de letras, sem
          // quebra no meio.
          segment.text.split(/(\s+)/).map((token, tokenIndex) => {
            if (token === "") return null;
            if (/^\s+$/.test(token)) {
              return token;
            }
            return (
              <span
                key={`${segIndex}-${tokenIndex}`}
                className="inline-block"
              >
                {Array.from(token).map((char) => {
                  const idx = letterIndex++;
                  return (
                    <span
                      key={idx}
                      ref={(el) => {
                        lettersRef.current[idx] = el;
                      }}
                      className={`kinetic-letter ${segment.className ?? ""}`}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            );
          }),
        )}
      </span>
    </Tag>
  );
}
