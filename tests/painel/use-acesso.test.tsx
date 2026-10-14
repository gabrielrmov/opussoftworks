// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabase } from "@/lib/supabase/client";
import { useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/supabase/client");

const mockedGetSupabase = vi.mocked(getSupabase);

function fakeClient(opts: {
  session: { user: { email: string } } | null | "pendente";
  linha?: { papel: "admin" | "membro"; ativo: boolean } | null;
  erro?: boolean;
}) {
  const unsubscribe = vi.fn();
  const maybeSingle = vi.fn().mockResolvedValue(
    opts.erro
      ? { data: null, error: { message: "falha" } }
      : { data: opts.linha ?? null, error: null },
  );
  const client = {
    auth: {
      getSession: vi.fn(() =>
        opts.session === "pendente"
          ? new Promise(() => {})
          : Promise.resolve({ data: { session: opts.session } }),
      ),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe } },
      })),
    },
    from: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle })) })),
  };
  return { client, maybeSingle, unsubscribe };
}

const sessao = { user: { email: "pessoa@exemplo.test" } };

describe("useAcesso", () => {
  beforeEach(() => {
    mockedGetSupabase.mockReset();
  });

  it("sem variáveis → nao-configurado", async () => {
    mockedGetSupabase.mockReturnValue(null);
    const { result } = renderHook(() => useAcesso());
    await waitFor(() => expect(result.current.estado).toBe("nao-configurado"));
  });

  it("sem sessão → sem-sessao", async () => {
    const { client, maybeSingle } = fakeClient({ session: null });
    mockedGetSupabase.mockReturnValue(client as never);
    const { result } = renderHook(() => useAcesso());
    await waitFor(() => expect(result.current.estado).toBe("sem-sessao"));
    expect(maybeSingle).not.toHaveBeenCalled();
  });

  it("sessão mas sem linha em membros → sem-acesso", async () => {
    const { client } = fakeClient({ session: sessao, linha: null });
    mockedGetSupabase.mockReturnValue(client as never);
    const { result } = renderHook(() => useAcesso());
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
  });

  it("sessão e linha ativa → ok, com o papel", async () => {
    const { client } = fakeClient({
      session: sessao,
      linha: { papel: "admin", ativo: true },
    });
    mockedGetSupabase.mockReturnValue(client as never);
    const { result } = renderHook(() => useAcesso());
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    expect(result.current.papel).toBe("admin");
    expect(result.current.email).toBe("pessoa@exemplo.test");
  });

  it("linha com ativo=false → sem-acesso", async () => {
    const { client } = fakeClient({
      session: sessao,
      linha: { papel: "membro", ativo: false },
    });
    mockedGetSupabase.mockReturnValue(client as never);
    const { result } = renderHook(() => useAcesso());
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
    expect(result.current.papel).toBeUndefined();
  });

  it("enquanto carrega → carregando, nunca ok", async () => {
    const { client, unsubscribe } = fakeClient({ session: "pendente" });
    mockedGetSupabase.mockReturnValue(client as never);
    const { result, unmount } = renderHook(() => useAcesso());
    expect(result.current.estado).toBe("carregando");
    await Promise.resolve();
    expect(result.current.estado).toBe("carregando");
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
