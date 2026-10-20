import { getSupabase } from "@/lib/supabase/client";

const NAO_CONFIGURADO = "Painel ainda não configurado.";

// Marcador para update/delete que não afetou linha alguma (apagado ou sem acesso).
export const CODIGO_NAO_SALVO = "NAO_SALVO";

export class ErroDeValidacao extends Error {}

export function exigirCliente() {
  const supabase = getSupabase();
  if (!supabase) throw new ErroDeValidacao(NAO_CONFIGURADO);
  return supabase;
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroDeValidacao) return erro.message;
  const e = (erro ?? {}) as { code?: unknown; message?: unknown };
  const texto = typeof e.message === "string" ? e.message.toLowerCase() : "";
  if (e.code === CODIGO_NAO_SALVO) return "O projeto não foi salvo: ele pode ter sido apagado ou seu acesso mudou.";
  if (e.code === "23505") return "Esse registro já existe.";
  if (texto.includes("ultimo admin")) return "É preciso manter pelo menos um admin ativo.";
  if (e.code === "23514") return "Algum campo está com um valor inválido.";
  if (e.code === "42501" || texto.includes("permission denied") || texto.includes("row-level security")) {
    return "Você não tem permissão para fazer isso.";
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}
