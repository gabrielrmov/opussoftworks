// Canal de contato oficial da OPUS SOFTWORKS. Centralizado aqui pra todo botão de
// CTA do site apontar sempre pro mesmo número, com a mesma formatação.
export const WHATSAPP_NUMBER = "5562994106910";
export const WHATSAPP_DISPLAY = "(62) 99410-6910";

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
