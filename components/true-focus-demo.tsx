"use client";

import TrueFocus from "@/components/ui/true-focus";

export default function TrueFocusDemo() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-10 rounded-3xl bg-[#0e0e13] p-16">
      <TrueFocus
        sentence="Tráfego Sistemas Sites"
        borderColor="#2f8cff"
        glowColor="rgba(47, 140, 255, 0.6)"
        animationDuration={0.5}
        pauseBetweenAnimations={1}
      />
      <p className="max-w-md text-center text-sm text-ash-text">
        Passa o mouse pra travar o foco manualmente, ou deixa correr sozinho
        entre as três palavras.
      </p>
    </div>
  );
}
