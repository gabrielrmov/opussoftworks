import React from 'react';
import {C, FONT} from '../../brand';

/**
 * Réplica do site real opussoftworks.com.br (a partir do print enviado),
 * desenhada em código para ficar nítida nas telas dos mockups.
 * Desktop em 1440 px de largura; mobile em 390 px. `scroll` em px da página.
 */
const SITE_FONT = '"Inter Tight", sans-serif';
const INK = '#161616';
const MUTED = '#5B5B5B';
const SOFT = '#F6F6F7';
const CARD = '#EEEEF0';

const Wordmark: React.FC<{size: number}> = ({size}) => (
  <span style={{fontFamily: FONT.title, fontSize: size, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
    <span style={{fontWeight: 700, color: C.coral}}>Opus</span>
    <span style={{fontWeight: 500, color: INK}}>SoftWorks</span>
  </span>
);

const Pill: React.FC<{dark?: boolean; coral?: boolean; size: number; children: React.ReactNode}> = ({dark, coral, size, children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: size * 3,
      padding: `0 ${size * 1.4}px`,
      borderRadius: size * 1.5,
      background: coral ? C.coral : dark ? INK : '#ECECEE',
      color: coral || dark ? '#fff' : INK,
      fontFamily: SITE_FONT,
      fontWeight: 500,
      fontSize: size,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const FRONTS = [
  {
    n: '01',
    title: 'Tráfego pago e aquisição',
    body: 'Campanhas em Meta e Google guiadas por números que importam: custo por cliente, taxa de fechamento e retorno sobre o investimento. Lead não é resultado.',
    strong: 'Venda é.',
  },
  {
    n: '02',
    title: 'Sistemas e automações',
    body: 'Entendemos como a operação funciona, eliminamos tarefas repetitivas e centralizamos as informações que hoje estão espalhadas.',
    strong: 'Menos trabalho manual. Mais controle para decidir.',
  },
  {
    n: '03',
    title: 'Sites que convertem',
    body: 'Sites rápidos, claros e pensados para vender. Em poucos segundos, o visitante entende o que a empresa faz, por que escolher você e',
    strong: 'qual é o próximo passo.',
  },
];

const STEPS = [
  {name: 'Diagnóstico', n: '01', lead: 'Antes de propor, a gente entende.', body: 'Mergulhamos na operação, nas metas, nos números e nos gargalos para identificar o que realmente precisa ser resolvido.'},
  {name: 'Estratégia', n: '02', lead: 'Prioridade antes de execução.', body: 'Definimos o que atacar primeiro, onde investir e quais indicadores vão mostrar, na prática, se estamos no caminho certo.'},
];

const Kicker: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{fontFamily: SITE_FONT, fontWeight: 500, fontSize: size, letterSpacing: '0.18em', color: C.coral, textAlign: 'center'}}>{children}</div>
);

/** "Tráfego Sistemas Sites" com as duas primeiras desfocadas e cantoneiras em "Sites" (como no site). */
const FocusWords: React.FC<{size: number}> = ({size}) => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: size * 0.3, fontFamily: SITE_FONT, fontWeight: 600, fontSize: size, letterSpacing: '-0.03em', color: INK}}>
    <span style={{filter: `blur(${size * 0.08}px)`, opacity: 0.55}}>Tráfego</span>
    <span style={{filter: `blur(${size * 0.08}px)`, opacity: 0.55}}>Sistemas</span>
    <span style={{position: 'relative', padding: `0 ${size * 0.12}px`}}>
      Sites
      {[
        {left: 0, top: -size * 0.12, borderLeft: true, borderTop: true},
        {right: 0, top: -size * 0.12, borderTop: true},
        {left: 0, bottom: -size * 0.1, borderLeft: true},
        {right: 0, bottom: -size * 0.1},
      ].map((c, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            width: size * 0.16,
            height: size * 0.16,
            left: c.left,
            right: c.right,
            top: c.top,
            bottom: c.bottom,
            borderStyle: 'solid',
            borderColor: C.coral,
            borderWidth: `${c.top !== undefined ? 3 : 0}px ${c.left === undefined ? 3 : 0}px ${c.bottom !== undefined ? 3 : 0}px ${c.left !== undefined ? 3 : 0}px`,
          }}
        />
      ))}
    </span>
  </div>
);

const Dots: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  backgroundImage: 'radial-gradient(rgba(22,22,22,0.12) 1px, transparent 1.2px)',
  backgroundSize: '18px 18px',
};

export const REAL_SITE_WIDTH = {desktop: 1440, mobile: 390};

export const RealSite: React.FC<{variant: 'desktop' | 'mobile'; scroll: number}> = ({variant, scroll}) => {
  const desk = variant === 'desktop';
  const W = REAL_SITE_WIDTH[variant];
  return (
    <div style={{width: W, transform: `translateY(${-scroll}px)`, fontFamily: SITE_FONT, color: INK, background: SOFT}}>
      {/* Hero */}
      <div style={{...Dots, padding: desk ? '22px 0 64px' : '58px 18px 44px', borderBottom: '1px solid #E6E6E8'}}>
        <div
          style={{
            margin: '0 auto',
            width: desk ? 720 : '100%',
            height: desk ? 60 : 54,
            borderRadius: 999,
            background: '#fff',
            boxShadow: '0 8px 26px rgba(22,22,22,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: desk ? '0 10px 0 28px' : '0 8px 0 18px',
            boxSizing: 'border-box',
          }}
        >
          <Wordmark size={desk ? 26 : 21} />
          {desk && (
            <div style={{display: 'flex', gap: 34, fontSize: 15, color: MUTED}}>
              <span>Soluções</span>
              <span>Método</span>
              <span>Perguntas frequentes</span>
            </div>
          )}
          {desk ? (
            <Pill coral size={14}>Entrar em contato ↗</Pill>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 5, padding: '0 12px'}}>
              <span style={{width: 22, height: 2.5, background: INK, borderRadius: 2}} />
              <span style={{width: 22, height: 2.5, background: INK, borderRadius: 2}} />
            </div>
          )}
        </div>
        <div style={{textAlign: 'center', marginTop: desk ? 44 : 46}}>
          <div style={{fontWeight: 600, fontSize: desk ? 56 : 40, lineHeight: 1.08, letterSpacing: '-0.04em'}}>
            Resultado não é sorte. <span style={{color: C.coral}}>É entrega.</span>
          </div>
          <div style={{margin: desk ? '26px auto 0' : '20px auto 0', maxWidth: desk ? 610 : 340, fontSize: desk ? 27 : 19, lineHeight: 1.35, color: MUTED, letterSpacing: '-0.02em'}}>
            Estratégia, tecnologia e IA para empresas que querem vender mais, operar melhor e crescer com clareza.
          </div>
          <div style={{display: 'flex', gap: 12, justifyContent: 'center', flexDirection: desk ? 'row' : 'column', alignItems: 'center', marginTop: desk ? 36 : 28}}>
            <Pill dark size={desk ? 16 : 16}>Falar com um especialista ↗</Pill>
            <Pill size={desk ? 16 : 16}>Conhecer soluções</Pill>
          </div>
        </div>
      </div>

      {/* Três frentes */}
      <div style={{padding: desk ? '86px 0 70px' : '56px 18px 40px'}}>
        <Kicker size={desk ? 14 : 12}>ONDE A OPUS SOFTWORKS ENTRA</Kicker>
        <div style={{marginTop: 22}}>
          <FocusWords size={desk ? 52 : 34} />
        </div>
        <div style={{textAlign: 'center', fontWeight: 600, fontSize: desk ? 33 : 25, letterSpacing: '-0.03em', marginTop: 16}}>Três frentes, uma mesma estratégia.</div>
        <div style={{textAlign: 'center', margin: '18px auto 0', maxWidth: desk ? 760 : 350, fontSize: desk ? 17 : 15, lineHeight: 1.6, color: MUTED}}>
          Raramente o problema é só um. Quase sempre é aquisição, operação e presença digital puxando para lados diferentes. Trabalhamos nos três, na ordem que fizer sentido.
        </div>
        <div style={{display: 'flex', flexDirection: desk ? 'row' : 'column', gap: 14, margin: '40px auto 0', width: desk ? 1000 : '100%'}}>
          {FRONTS.map((c) => (
            <div key={c.n} style={{flex: 1, background: CARD, borderRadius: 18, padding: '26px 26px 30px'}}>
              <div style={{color: C.coral, fontSize: 15, letterSpacing: '0.06em'}}>{c.n}</div>
              <div style={{fontWeight: 500, fontSize: 18, marginTop: 20}}>{c.title}</div>
              <div style={{fontSize: 15, lineHeight: 1.6, color: MUTED, marginTop: 14}}>
                {c.body} <span style={{color: INK, fontWeight: 600}}>{c.strong}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Como trabalhamos */}
      <div style={{padding: desk ? '70px 0 90px' : '40px 18px 60px', background: '#FAFAFB'}}>
        <Kicker size={desk ? 14 : 12}>COMO TRABALHAMOS</Kicker>
        <div style={{textAlign: 'center', fontWeight: 600, fontSize: desk ? 36 : 28, letterSpacing: '-0.03em', marginTop: 16}}>Clareza antes de velocidade.</div>
        <div style={{display: 'flex', flexDirection: desk ? 'row' : 'column', margin: '40px auto 0', width: desk ? 1100 : '100%', background: '#fff', borderRadius: 18, boxShadow: 'inset 0 0 0 1px #E6E6E8'}}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{flex: 1, padding: 30, borderLeft: desk && i ? '1px solid #E6E6E8' : undefined, borderTop: !desk && i ? '1px solid #E6E6E8' : undefined}}>
              <div style={{fontSize: 18, fontWeight: 500}}>
                {s.name} <span style={{color: C.coral, fontSize: 15, marginLeft: 8}}>{s.n}</span>
              </div>
              <div style={{fontSize: 15, fontWeight: 500, marginTop: 26}}>{s.lead}</div>
              <div style={{fontSize: 15, lineHeight: 1.6, color: MUTED, marginTop: 12}}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
