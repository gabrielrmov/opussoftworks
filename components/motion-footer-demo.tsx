"use client";

import { CinematicFooter } from "@/components/ui/motion-footer";

export default function MotionFooterDemo() {
  return (
    <div className="relative w-full min-h-screen bg-background font-sans selection:bg-white/20 overflow-x-hidden">
      <main className="relative z-10 flex min-h-[120vh] w-full flex-col items-center justify-center rounded-b-3xl border-b border-white/10 bg-background text-white shadow-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

        <h1 className="mb-8 px-4 text-center text-4xl font-light uppercase tracking-[0.2em] text-neutral-400 md:text-5xl">
          Scroll down to reveal
        </h1>

        <div className="h-32 w-px bg-gradient-to-b from-neutral-400 to-transparent" />
      </main>

      <CinematicFooter />
    </div>
  );
}
