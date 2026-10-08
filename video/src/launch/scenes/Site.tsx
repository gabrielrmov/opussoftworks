import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import SITE_META from "../../../public/site/opus-390.json";
import { SITE } from "../../timeline";
import { enter } from "../anim";
import { DotGrid } from "../fx";
import { circlePath, Pen } from "../pen";
import { SAFE } from "../tokens";

/**
 * O site de verdade (screenshot do Playwright, 390×844 @3x) num celular,
 * rolando hero → "Três frentes" → card 01. O círculo de caneta usa a posição
 * real de "Venda é." (getBoundingClientRect) e o push-in fecha nele.
 */
const VIEW_W = SITE_META.viewport.width; // 390 px CSS
const VIEW_H = SITE_META.viewport.height; // 844 px CSS
const SCREEN_W = 560;
const K = SCREEN_W / VIEW_W; // px de vídeo por px CSS
const SCREEN_H = VIEW_H * K;
const BEZEL = 20;
const PHONE = { w: SCREEN_W + BEZEL * 2, h: SCREEN_H + BEZEL * 2 };
const PHONE_LEFT = (1080 - PHONE.w) / 2;
const PHONE_TOP = (SAFE.top + SAFE.bottom) / 2 - PHONE.h / 2;
const SCREEN = { x: PHONE_LEFT + BEZEL, y: PHONE_TOP + BEZEL };
const IMG_H = SITE_META.pageHeight * K;

const scrollAt = (f: number) => {
  const k = SITE.scroll;
  if (f <= k[0].f) return k[0].y;
  for (let i = 0; i < k.length - 1; i++) {
    if (f <= k[i + 1].f) {
      return interpolate(f, [k[i].f, k[i + 1].f], [k[i].y, k[i + 1].y], { easing: Easing.inOut(Easing.cubic) });
    }
  }
  return k[k.length - 1].y;
};

/** Centro de "Venda é." em coordenadas do vídeo, com a página rolada até o fim do trajeto. */
const V = SITE_META.rects.vendaE;
const FINAL_SCROLL = SITE.scroll[SITE.scroll.length - 1].y;
export const VENDA_CENTER = {
  x: SCREEN.x + (V.x + V.w / 2) * K,
  y: SCREEN.y + (V.y - FINAL_SCROLL + V.h / 2) * K,
};
const VENDA_BOX = { w: V.w * K, h: V.h * K };

const fixedImg = (id: string) => SITE_META.fixed.find((x) => x.id === id);

export const Site: React.FC = () => {
  const f = useCurrentFrame();
  const scrollY = scrollAt(f);
  const inP = enter(f, SITE.enter, 8);

  // Push-in acelerando, centrado em "Venda é." (que também vai pro centro do quadro).
  const p = interpolate(f, [SITE.pushFrom, SITE.pushTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const s = 1 + (SITE.pushScale - 1) * p;
  const dx = (540 - VENDA_CENTER.x) * p;
  const dy = ((SAFE.top + SAFE.bottom) / 2 - VENDA_CENTER.y) * p;

  const header = fixedImg("fixed-0");
  const fab = fixedImg("fixed-2");

  return (
    <AbsoluteFill>
      <DotGrid />
      <AbsoluteFill
        style={{
          transformOrigin: `${VENDA_CENTER.x}px ${VENDA_CENTER.y}px`,
          transform: `translate(${dx}px, ${dy}px) scale(${s})`,
        }}
      >
        {/* Celular */}
        <div
          style={{
            position: "absolute",
            left: PHONE_LEFT,
            top: PHONE_TOP,
            width: PHONE.w,
            height: PHONE.h,
            borderRadius: 96,
            backgroundColor: "#0c0c0e",
            boxShadow: "0 60px 120px rgba(18,18,20,0.28), 0 18px 36px rgba(18,18,20,0.18)",
            transform: `translateY(${(1 - inP) * 120}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: BEZEL,
              top: BEZEL,
              width: SCREEN_W,
              height: SCREEN_H,
              borderRadius: 96 - BEZEL,
              overflow: "hidden",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Img
              src={staticFile("site/opus-390.png")}
              style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: IMG_H, transform: `translateY(${-scrollY * K}px)` }}
            />
            {header && (
              <Img
                src={staticFile("site/fixed-0.png")}
                style={{
                  position: "absolute",
                  left: header.x * K,
                  top: header.y * K,
                  width: header.w * K,
                  height: header.h * K,
                  clipPath: `inset(0 ${4.1}% 0 ${4.1}% round ${(header.h * K) / 2}px)`,
                }}
              />
            )}
            {fab && (
              <Img
                src={staticFile("site/fixed-2.png")}
                style={{ position: "absolute", left: fab.x * K, top: fab.y * K, width: fab.w * K, height: fab.h * K, clipPath: "circle(50%)" }}
              />
            )}
          </div>
        </div>
        {/* Círculo de caneta em volta de "Venda é." */}
        <Pen
          d={circlePath(VENDA_CENTER.x, VENDA_CENTER.y, VENDA_BOX.w / 2 + 16, VENDA_BOX.h / 2 + 15, "venda")}
          from={SITE.circleFrom}
          to={SITE.circleTo}
          width={6}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
