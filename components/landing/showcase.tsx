import LetterGlitch from "@/components/ui/letter-glitch";

export default function Showcase() {
  return (
    <section className="mx-auto max-w-[960px] px-6 py-16 sm:px-11 sm:py-24">
      <h2 className="text-center font-intertight text-3xl font-medium tracking-[-0.02em] text-landing-ink sm:text-[42px]">
        Tudo sob o mesmo teto.
      </h2>

      <div className="relative mt-10 flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-landing-ink/10 bg-landing-card px-6 text-center">
        <div className="absolute inset-0 opacity-[0.12]">
          <LetterGlitch
            glitchColors={["#ff6039", "#ffb6a4", "#171717"]}
            glitchSpeed={60}
            smooth
            lightMode
            backgroundColor="transparent"
            outerVignette={false}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className="text-landing-accent"
        >
          <rect
            x="6"
            y="10"
            width="52"
            height="36"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <rect x="12" y="30" width="6" height="10" rx="1" fill="currentColor" fillOpacity="0.5" />
          <rect x="22" y="24" width="6" height="16" rx="1" fill="currentColor" fillOpacity="0.7" />
          <rect x="32" y="18" width="6" height="22" rx="1" fill="currentColor" />
          <rect x="42" y="26" width="6" height="14" rx="1" fill="currentColor" fillOpacity="0.6" />
          <path d="M22 50L28 56M42 50L36 56" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
          <p className="max-w-md text-sm text-landing-muted">
            Espaço para uma imagem ou vídeo do seu trabalho — painel,
            bastidores ou case.
          </p>
        </div>
      </div>

      <p className="mt-10 text-center text-lg leading-snug sm:text-xl">
        <span className="font-medium text-landing-ink">
          Tráfego, sistemas e site conversando entre si,
        </span>{" "}
        <span className="text-landing-muted">
          com um time só olhando para o mesmo número: o seu resultado.
        </span>
      </p>
    </section>
  );
}
