import { getSupabase } from "@/lib/supabase/client";

export type Papel = "admin" | "membro";
export type Membro = { id: string; email: string; papel: Papel; ativo: boolean };

const NAO_CONFIGURADO = "Painel ainda não configurado.";
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class ErroDeValidacao extends Error {}

function cliente() {
  const supabase = getSupabase();
  if (!supabase) throw new ErroDeValidacao(NAO_CONFIGURADO);
  return supabase;
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroDeValidacao) return erro.message;
  const e = (erro ?? {}) as { code?: unknown; message?: unknown };
  const texto = typeof e.message === "string" ? e.message.toLowerCase() : "";
  if (e.code === "23505") return "Este e-mail já está na lista.";
  if (texto.includes("ultimo admin")) return "É preciso manter pelo menos um admin ativo.";
  if (e.code === "42501" || texto.includes("permission denied") || texto.includes("row-level security")) {
    return "Você não tem permissão para fazer isso.";
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

export async function listarMembros(): Promise<Membro[]> {
  const { data, error } = await cliente().from("membros").select("id, email, papel, ativo").order("email");
  if (error) throw error;
  return (data ?? []) as Membro[];
}

export async function adicionarMembro(email: string, papel: Papel): Promise<void> {
  const limpo = email.trim().toLowerCase();
  if (!EMAIL_VALIDO.test(limpo)) throw new ErroDeValidacao("Informe um e-mail válido.");
  const { error } = await cliente().from("membros").insert({ email: limpo, papel });
  if (error) throw error;
}

export async function definirAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await cliente().from("membros").update({ ativo }).eq("id", id);
  if (error) throw error;
}
