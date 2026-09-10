import Link from "next/link";
import Image from "next/image";
import logoWhite from "@/public/images/elevion-logo-white.png";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center"
      aria-label="ELEVION"
    >
      <Image
        src={logoWhite}
        alt="ELEVION"
        className="h-7 w-auto"
        priority
      />
    </Link>
  );
}
