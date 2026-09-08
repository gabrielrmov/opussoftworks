"use client";

import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Nav links */}
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link
              href="#servicos"
              className="text-sm font-medium text-gray-300 transition hover:text-gray-100"
            >
              Serviços
            </Link>
            <Link
              href="#como-trabalhamos"
              className="text-sm font-medium text-gray-300 transition hover:text-gray-100"
            >
              Como trabalhamos
            </Link>
            <Link
              href="#principios"
              className="text-sm font-medium text-gray-300 transition hover:text-gray-100"
            >
              Princípios
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex flex-1 items-center justify-end">
            <Link
              href="#contato"
              className="btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
            >
              Fale com a gente
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
