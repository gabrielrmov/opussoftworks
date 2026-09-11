import { WHATSAPP_DISPLAY, getWhatsAppUrl } from "@/lib/whatsapp";
import KineticText from "@/components/ui/kinetic-text";

const CTA_WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero solicitar meu diagnóstico gratuito com a ELEVION. Vim pelo site.",
);

export default function Cta() {
  return (
    <section className="relative" id="contato">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="relative overflow-hidden rounded-2xl bg-liquid-deep px-6 py-16 text-center sm:px-12 md:py-[120px]">
            <div
              aria-hidden="true"
              className="animate-glow-pulse pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-indigo/25 blur-[100px]"
            />
            <div className="relative mx-auto max-w-3xl">
              <KineticText
                as="h2"
                className="pb-5 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl lg:text-6xl"
                data-aos="fade-up"
                segments={[
                  { text: "Pronto para parar de deixar " },
                  { text: "resultado", className: "text-lavender-phosphor" },
                  { text: " na mesa?" },
                ]}
              />
              <p
                className="mx-auto mb-8 max-w-xl text-lg text-silver-mist"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                Diagnóstico gratuito, sem compromisso. Você decide se faz
                sentido depois de ver, na prática, onde dá pra melhorar.
              </p>
              <div
                className="mx-auto flex max-w-xs justify-center sm:max-w-none"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                <a
                  className="bg-bioluminescent w-full rounded-md px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-1 hover:opacity-90 hover:shadow-[0_20px_50px_-15px_rgba(91,94,245,0.6)] active:translate-y-0 sm:w-auto"
                  href={CTA_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quero meu diagnóstico
                </a>
              </div>
              <p
                className="mt-6 text-xs uppercase tracking-[0.1em] text-slate-deep"
                data-aos="fade-up"
                data-aos-delay={500}
              >
                WhatsApp {WHATSAPP_DISPLAY} · Goiânia, GO
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
