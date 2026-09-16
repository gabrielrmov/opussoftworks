"use client";

import SpecularButton from "@/components/ui/specular-button";

export default function SpecularButtonDemo() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-10 rounded-3xl bg-[#0e0e13] p-16">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <SpecularButton size="lg" lineColor="#2f8cff" baseColor="#1f1f2b">
          Falar com um especialista
        </SpecularButton>
        <SpecularButton size="md" autoAnimate lineColor="#ffffff" baseColor="#333340">
          Começar agora
        </SpecularButton>
        <SpecularButton size="sm" followMouse={false} autoAnimate speed={0.6}>
          Saiba mais
        </SpecularButton>
      </div>
      <p className="max-w-md text-center text-sm text-ash-text">
        O brilho segue o cursor pela tela inteira; perto do botão ele se
        acomoda na diagonal e reage à posição exata do mouse.
      </p>
    </div>
  );
}
