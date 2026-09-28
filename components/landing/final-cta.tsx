import { getWhatsAppUrl } from "@/lib/whatsapp";

const WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero conversar sobre a OPUS SOFTWORKS.",
);

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-[960px] px-6 py-20 text-center sm:px-11 sm:py-28">
      <h2 className="font-instrument text-4xl leading-[1.1] text-landing-ink sm:text-5xl lg:text-[60px]">
        Estratégia, aliada à execução.
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-landing-muted sm:text-sm">
        Sua empresa não precisa de mais uma ferramenta. Precisa de um sistema
        que funcione.
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-landing-ink px-6 py-3 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Conversar no WhatsApp
      </a>
    </section>
  );
}
