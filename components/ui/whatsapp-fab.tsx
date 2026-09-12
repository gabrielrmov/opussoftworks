import { WHATSAPP_DISPLAY, getWhatsAppUrl } from "@/lib/whatsapp";

const FAB_WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero solicitar meu diagnóstico gratuito com a ELEVION.",
);

/**
 * Botão flutuante de WhatsApp, fixo no canto da tela em todas as páginas.
 * Usa o verde oficial do WhatsApp (fora da paleta da marca de propósito):
 * é um afordance universalmente reconhecido no Brasil — manter a cor exata
 * ajuda mais na conversão do que forçar consistência de marca aqui.
 */
export default function WhatsappFab() {
  return (
    <a
      href={FAB_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp: ${WHATSAPP_DISPLAY}`}
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-110 active:scale-95 sm:bottom-8 sm:right-8 [.mobile-menu-open_&]:pointer-events-none [.mobile-menu-open_&]:scale-75 [.mobile-menu-open_&]:opacity-0"
    >
      <span
        aria-hidden="true"
        className="animate-pulse-soft pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-70 blur-md"
      />
      <svg
        className="relative h-7 w-7"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2c-5.522 0-9.999 4.477-9.999 9.999 0 1.764.464 3.49 1.345 5.006l-1.428 5.212 5.336-1.4a9.958 9.958 0 0 0 4.746 1.209h.004c5.522 0 9.999-4.478 9.999-10a9.94 9.94 0 0 0-2.928-7.071A9.94 9.94 0 0 0 12.001 2Zm.002 18.253h-.003a8.264 8.264 0 0 1-4.212-1.155l-.302-.18-3.144.825.839-3.065-.198-.315a8.26 8.26 0 0 1-1.267-4.4c0-4.556 3.708-8.263 8.264-8.263a8.207 8.207 0 0 1 5.845 2.42 8.207 8.207 0 0 1 2.418 5.845c0 4.556-3.708 8.264-8.24 8.264Z" />
      </svg>
    </a>
  );
}
