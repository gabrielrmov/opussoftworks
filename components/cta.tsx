import { WHATSAPP_DISPLAY, getWhatsAppUrl } from "@/lib/whatsapp";
import KineticText from "@/components/ui/kinetic-text";
import LiquidCarveButton from "@/components/ui/liquid-carve-button";
import WebThreads from "@/components/ui/web-threads";

const CTA_WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero solicitar meu diagnóstico gratuito com a ELEVION. Vim pelo site.",
);

export default function Cta() {
  return (
    <section className="relative" id="contato">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* React Bits WebThreads, cor da marca (a lib vem com roxo/rosa
            por padrão) — fios convergindo no centro, reage ao mouse. */}
        <WebThreads
          color1="#2F8CFF"
          color2="#8FC4FF"
          color3="#FFFFFF"
          speed={0.2}
          threadCount={6}
          frequency={5}
          spread={0.16}
          taper={1}
          position={0.5}
          fanMode="center"
          glow={0.02}
          falloff={0.6}
          thickness={1.1}
          brightness={0.5}
          opacity={0.8}
          mirror
          shimmer={false}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-20 md:py-32">
          <div className="relative overflow-hidden px-6 text-center sm:px-12">
            <div className="relative mx-auto max-w-3xl">
              <KineticText
                as="h2"
                className="pb-5 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl lg:text-6xl"
                data-aos="fade-up"
                segments={[
                  { text: "Pronto para parar de deixar " },
                  { text: "resultado", className: "text-ivory-text" },
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
                <LiquidCarveButton
                  label="Quero meu diagnóstico"
                  link={CTA_WHATSAPP_URL}
                  newTab
                  colors={{ fill: "#2F8CFF", textColor: "#FFFFFF" }}
                  blob={{ color: "#DCEEFF", size: 90, smoothness: 55 }}
                  rounded={100}
                  padding="14px 32px"
                  font={{
                    fontFamily: "inherit",
                    fontWeight: 600,
                    fontSize: 12,
                    lineHeight: "1em",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textAlign: "left",
                  }}
                />
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
