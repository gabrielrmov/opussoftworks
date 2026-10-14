import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/**
 * Cliente Supabase do navegador (singleton). Usa apenas a URL pública e a
 * anon key. Retorna null se alguma variável faltar, para o site continuar
 * buildando sem elas.
 */
export function getSupabase(): SupabaseClient | null {
  // Leitura literal: o Next só embute estas variáveis no build estático assim.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (!cliente) cliente = createClient(url, anonKey);
  return cliente;
}
