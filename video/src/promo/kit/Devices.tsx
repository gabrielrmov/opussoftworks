import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT, SITE_SCREENSHOTS} from '../../brand';
import {OpusSymbol} from '../../components/OpusSymbol';
import {Glyph, GlyphName} from './Glyph';
import {REAL_SITE_WIDTH, RealSite} from './RealSite';
import {Skel} from './UI';

/** Celular com tela recortada; aceita rotação 3D. */
export const Phone: React.FC<{width: number; children: React.ReactNode; style?: React.CSSProperties}> = ({width, children, style}) => {
  const h = width * 2.05;
  const pad = width * 0.045;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.16,
        background: `linear-gradient(140deg, #3A3A3A, ${C.graphite} 40%)`,
        padding: pad,
        boxSizing: 'border-box',
        boxShadow: '0 40px 80px rgba(22,22,22,0.28)',
        ...style,
      }}
    >
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: width * 0.125, overflow: 'hidden', background: C.white}}>
        {children}
        <div style={{position: 'absolute', top: width * 0.03, left: '50%', width: width * 0.3, height: width * 0.075, marginLeft: -width * 0.15, borderRadius: 99, background: C.graphite}} />
      </div>
    </div>
  );
};

/** Largura útil da tela de cada aparelho (descontada a moldura). */
export const phoneScreenWidth = (w: number) => w * (1 - 0.09);
export const laptopScreenWidth = (w: number) => w * (1 - 0.044);

/** Notebook: tela + base. */
export const Laptop: React.FC<{width: number; children: React.ReactNode; style?: React.CSSProperties}> = ({width, children, style}) => {
  const screenH = width * 0.62;
  return (
    <div style={{width: width * 1.14, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>
      <div
        style={{
          width,
          height: screenH,
          borderRadius: width * 0.035,
          background: C.graphite,
          padding: width * 0.022,
          boxSizing: 'border-box',
          boxShadow: '0 40px 80px rgba(22,22,22,0.22)',
        }}
      >
        <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: width * 0.01, background: C.white}}>{children}</div>
      </div>
      <div style={{width: width * 1.14, height: width * 0.03, borderRadius: `0 0 ${width * 0.03}px ${width * 0.03}px`, background: 'linear-gradient(#D6D7DB, #9C9C9C)'}} />
    </div>
  );
};

const Brand: React.FC<{scale: number}> = ({scale}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
    <svg width={36 * scale} height={24 * scale} style={{overflow: 'visible'}}>
      <OpusSymbol cx={18 * scale} cy={12 * scale} width={36 * scale} />
    </svg>
    <span style={{fontFamily: FONT.title, fontSize: 17 * scale}}>
      <span style={{fontWeight: 700, color: C.coral}}>Opus</span>
      <span style={{fontWeight: 500, color: C.graphite}}>SoftWorks</span>
    </span>
  </div>
);

const SERVICES: {glyph: GlyphName; title: string; sub: string}[] = [
  {glyph: 'trend', title: 'TRÁFEGO', sub: 'Aquisição'},
  {glyph: 'sistemas', title: 'SISTEMAS', sub: 'Automação'},
  {glyph: 'sites', title: 'SITES', sub: 'Presença'},
];

const ServiceRow: React.FC<{s: (typeof SERVICES)[number]; scale: number}> = ({s, scale}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 14 * scale,
      boxShadow: `inset 0 0 0 ${1.5 * scale}px rgba(156,156,156,0.35)`,
      padding: 14 * scale,
      display: 'flex',
      alignItems: 'center',
      gap: 10 * scale,
      background: C.white,
    }}
  >
    <div style={{width: 34 * scale, height: 34 * scale, borderRadius: 9 * scale, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Glyph name={s.glyph} size={20 * scale} color={C.white} strokeWidth={6} />
    </div>
    <div>
      <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 13 * scale, color: C.graphite, letterSpacing: '0.04em'}}>{s.title}</div>
      <div style={{fontFamily: FONT.text, fontSize: 11 * scale, color: C.g500}}>{s.sub}</div>
    </div>
  </div>
);

/** Reflexo de luz que atravessa a tela na diagonal. `t` 0..1 = posição do reflexo. */
export const Glare: React.FC<{t: number}> = ({t}) =>
  t <= 0 || t >= 1 ? null : (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `linear-gradient(115deg, transparent ${t * 160 - 40}%, rgba(255,255,255,0.55) ${t * 160 - 25}%, transparent ${t * 160 - 10}%)`,
      }}
    />
  );

/**
 * Tela do site rolando (`progress` 0..1). Usa o print real quando configurado em
 * SITE_SCREENSHOTS; senão, a página-modelo desenhada em código.
 */
export const SiteScreen: React.FC<{variant: 'desktop' | 'mobile'; progress?: number; screenWidth: number; maxScroll?: number}> = ({
  variant,
  progress = 0,
  screenWidth,
  maxScroll,
}) => {
  const desk = variant === 'desktop';
  const shot = desk ? SITE_SCREENSHOTS.desktop : SITE_SCREENSHOTS.mobile;
  if (shot) {
    const max = desk ? SITE_SCREENSHOTS.desktopScroll : SITE_SCREENSHOTS.mobileScroll;
    return (
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <Img src={staticFile(shot)} style={{width: '100%', display: 'block', transform: `translateY(${-progress * max * 100}%)`}} />
      </div>
    );
  }
  const zoom = screenWidth / REAL_SITE_WIDTH[variant];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${zoom})`, transformOrigin: '0 0'}}>
      <RealSite variant={variant} scroll={progress * (maxScroll ?? (desk ? 330 : 1050))} />
    </div>
  );
};

/** Página-modelo genérica (não usada desde a réplica do site real; mantida como alternativa). */
export const MockSite: React.FC<{desk: boolean; scroll: number}> = ({desk, scroll}) => {
  const s = desk ? 1.4 : 1;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${-scroll}px)`}}>
      <div style={{height: 56 * s, padding: `${desk ? 0 : 26}px ${20 * s}px 0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Brand scale={s * (desk ? 1 : 0.9)} />
        {desk ? (
          <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
            <Skel w={56} h={10} />
            <Skel w={56} h={10} />
            <Skel w={56} h={10} />
            <div style={{width: 110, height: 34, borderRadius: 17, background: C.coral}} />
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
            <Skel w={22} h={3} color={C.graphite} />
            <Skel w={22} h={3} color={C.graphite} />
          </div>
        )}
      </div>
      <div style={{display: 'flex', gap: 24 * s, padding: `${18 * s}px ${20 * s}px`, flexDirection: desk ? 'row' : 'column'}}>
        <div style={{flex: 1.2}}>
          <div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: desk ? 54 : 34, lineHeight: 1.05, color: C.graphite}}>
            Estratégia, aliada à <span style={{color: C.coral}}>execução.</span>
          </div>
          <Skel w={desk ? 340 : 200} h={desk ? 12 : 9} style={{marginTop: 20 * s}} />
          <Skel w={desk ? 260 : 150} h={desk ? 12 : 9} style={{marginTop: 10 * s}} />
          <div style={{marginTop: 22 * s, width: desk ? 230 : 170, height: desk ? 56 : 44, borderRadius: 30, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: FONT.title, fontWeight: 700, fontSize: desk ? 18 : 14, color: C.white}}>opussoftworks.com.br</span>
          </div>
        </div>
        <div style={{flex: 1, minHeight: desk ? 260 : 170, borderRadius: 18 * s, background: C.graphite, position: 'relative', overflow: 'hidden'}}>
          <svg width="100%" height="100%" viewBox="0 0 200 150" style={{position: 'absolute', inset: 0}}>
            <OpusSymbol cx={100} cy={75} width={150} />
          </svg>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: desk ? 'row' : 'column', gap: 12 * s, padding: `${8 * s}px ${20 * s}px`}}>
        {SERVICES.map((sv) => (
          <ServiceRow key={sv.title} s={sv} scale={desk ? 1.25 : 1.1} />
        ))}
      </div>
    </div>
  );
};
