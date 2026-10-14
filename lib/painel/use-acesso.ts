"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export type Acesso = {
  estado: "carregando" | "nao-configurado" | "sem-sessao" | "sem-acesso" | "ok";
  papel?: "admin" | "membro";
  email?: string;
};

export function useAcesso(): Acesso {
  const [acesso, setAcesso] = useState<Acesso>({ estado: "carregando" });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAcesso({ estado: "nao-configurado" });
      return;
    }

    let ativo = true;
    let versao = 0;

    async function avaliar(
      session: { user: { email?: string } } | null,
    ): Promise<void> {
      const minha = ++versao;
      if (!supabase) return;
      if (!session) {
        if (ativo) setAcesso({ estado: "sem-sessao" });
        return;
      }
      const email = session.user.email;
      const { data, error } = await supabase
        .from("membros")
        .select("papel, ativo")
        .maybeSingle();
      if (!ativo || minha !== versao) return;
      if (error || !data || !data.ativo) {
        setAcesso({ estado: "sem-acesso", email });
        return;
      }
      setAcesso({ estado: "ok", papel: data.papel, email });
    }

    supabase.auth.getSession().then(({ data }) => avaliar(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, session) => {
      // Fora do callback para não bloquear o lock de auth do supabase-js.
      setTimeout(() => void avaliar(session), 0);
    });

    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return acesso;
}

export async function entrarComGoogle(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/painel` },
  });
}

export async function sair(): Promise<void> {
  await getSupabase()?.auth.signOut();
}
