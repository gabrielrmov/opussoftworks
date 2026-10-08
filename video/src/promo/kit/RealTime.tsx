import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';

/**
 * Tempo "real" do plano (sem as pausas de leitura). O fundo vivo e a câmera usam
 * este relógio, então continuam se movendo enquanto o texto está em pausa.
 */
const Ctx = createContext<{frame: number; length: number} | null>(null);

export const RealTimeProvider: React.FC<{length: number; children: React.ReactNode}> = ({length, children}) => {
  const frame = useCurrentFrame();
  return <Ctx.Provider value={{frame, length}}>{children}</Ctx.Provider>;
};

export const useRealTime = () => {
  const frame = useCurrentFrame();
  return useContext(Ctx) ?? {frame, length: 120};
};
