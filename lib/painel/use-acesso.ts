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
    let usuarioId: string | null | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    type Sessao = { user: { id: string; email?: string } } | null;

    // Sincrono: nunca mantem o estado do usuario anterior.
    function sincronizar(session: Sessao): void {
      if (!session) {
        usuarioId = null;
        versao++;
        setAcesso({ estado: "sem-sessao" });
      } else if (session.user.id !== usuarioId) {
        usuarioId = session.user.id;
        versao++;
        setAcesso({ estado: "carregando" });
      }
    }

    async function avaliar(session: Sessao): Promise<void> {
      if (!session || !supabase) return;
      const minha = ++versao;
      try {
        const email = session.user.email?.trim().toLowerCase();
        if (!email) {
          if (ativo && minha === versao) setAcesso({ estado: "sem-acesso" });
          return;
        }
        // Admin enxerga todas as linhas pela RLS: filtra pelo proprio e-mail.
        const { data, error } = await supabase
          .from("membros")
          .select("papel, ativo")
          .eq("email", email)
          .maybeSingle();
        if (!ativo || minha !== versao) return;
        if (error || !data || !data.ativo) {
          setAcesso({ estado: "sem-acesso", email });
          return;
        }
        setAcesso({ estado: "ok", papel: data.papel, email });
      } catch {
        // Falha fechada: nunca manter um "ok" antigo.
        if (ativo && minha === versao) setAcesso({ estado: "sem-acesso" });
      }
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!ativo) return;
        sincronizar(data.session);
        return avaliar(data.session);
      })
      .catch(() => {
        if (ativo) setAcesso({ estado: "sem-acesso" });
      });
    const { data } = supabase.auth.onAuthStateChange((evento, session) => {
      clearTimeout(timer);
      sincronizar(session);
      if (evento === "SIGNED_OUT") return;
      // Fora do callback para não bloquear o lock de auth do supabase-js.
      timer = setTimeout(() => void avaliar(session), 0);
    });

    return () => {
      ativo = false;
      clearTimeout(timer);
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
