export default function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Grid, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.09) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Slowly drifting aurora blobs, nudged toward the cursor */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform:
            "translate(calc((var(--mouse-x-ratio, 0.5) - 0.5) * 50px), calc((var(--mouse-y-ratio, 0.25) - 0.25) * 50px))",
        }}
      >
        <div className="animate-aurora-1 absolute left-1/2 top-[-15%] h-[26rem] w-[34rem] -translate-x-[70%] rounded-full bg-indigo-600/30 blur-[100px] motion-reduce:animate-none" />
      </div>
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform:
            "translate(calc((var(--mouse-x-ratio, 0.5) - 0.5) * -40px), calc((var(--mouse-y-ratio, 0.25) - 0.25) * -40px))",
        }}
      >
        <div className="animate-aurora-2 absolute left-1/2 top-[-8%] h-[22rem] w-[30rem] -translate-x-[15%] rounded-full bg-violet-500/25 blur-[100px] motion-reduce:animate-none" />
      </div>
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform:
            "translate(calc((var(--mouse-x-ratio, 0.5) - 0.5) * 25px), calc((var(--mouse-y-ratio, 0.25) - 0.25) * 25px))",
        }}
      >
        <div className="animate-aurora-3 absolute left-1/2 top-[6%] h-[20rem] w-[26rem] -translate-x-[115%] rounded-full bg-blue-500/20 blur-[100px] motion-reduce:animate-none" />
      </div>

      {/* Spotlight that follows the cursor */}
      <div
        className="absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background:
            "radial-gradient(520px circle at var(--mouse-x, 50%) var(--mouse-y, 10%), rgba(165,180,252,0.2), transparent 60%)",
        }}
      />
    </div>
  );
}
