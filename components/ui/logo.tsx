import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-2"
      aria-label="ELEVION"
    >
      <svg viewBox="0 0 28 24" width="22" height="19" fill="none" aria-hidden="true">
        <rect x="1" y="14" width="6" height="9" rx="1.5" className="fill-platinum" />
        <rect
          x="11"
          y="8"
          width="6"
          height="15"
          rx="1.5"
          className="fill-platinum"
          opacity="0.7"
        />
        <rect
          x="21"
          y="1"
          width="6"
          height="22"
          rx="1.5"
          className="fill-platinum"
          opacity="0.4"
        />
      </svg>
      <span className="font-nacelle text-lg font-medium uppercase tracking-[0.08em] text-platinum">
        ELEVION
      </span>
    </Link>
  );
}
