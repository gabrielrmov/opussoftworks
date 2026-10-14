// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabase } from "@/lib/supabase/client";
import { useAcesso } from "@/lib/painel/use-acesso";

vi.mock("@/lib/supabase/client");

const mockedGetSupabase = vi.mocked(getSupabase);

type Sessao = { user: { id: string; email: string } };
type Linha = { email: string; papel: "admin" | "membro"; ativo: boolean };

function fakeClient(opts: {
  session: Sessao | null | "pendente";
  rows?: Linha[];
  erro?: boolean;
  rejeita?: boolean;
  getSessionRejeita?: boolean;
}) {
  const unsubscribe = vi.fn();
  let callback: (evento: string, s: Sessao | null) => void = () => {};
  let gate: Promise<void> | null = null;
  const eq = vi.fn();
  const maybeSingle = vi.fn();
  const client = {
    auth: {
      getSession: vi.fn(() => {
        if (opts.getSessionRejeita) return Promise.reject(new Error("falha"));
        return opts.session === "pendente"
          ? new Promise(() => {})
          : Promise.resolve({ data: { session: opts.session } });
      }),
      onAuthStateChange: vi.fn((cb: typeof callback) => {
        callback = cb;
        return { data: { subscription: { unsubscribe } } };
      }),
    },
    from: vi.fn(() => {
      let filtro: string | undefined;
      const builder = {
        select: () => builder,
        eq: (coluna: string, valor: string) => {
          eq(coluna, valor);
          filtro = valor;
          return builder;
        },
        maybeSingle: async () => {
          maybeSingle();
          if (gate) await gate;
          if (opts.rejeita) throw new Error("rede");
          if (opts.erro) return { data: null, error: { message: "falha" } };
          const achadas = (opts.rows ?? []).filter(
            (r) => filtro === undefined || r.email === filtro,
          );
          if (achadas.length > 1) {
            return { data: null, error: { message: "multiple rows" } };
          }
          return { data: achadas[0] ?? null, error: null };
        },
      };
      return builder;
    }),
  };
  return {
    client,
    eq,
    maybeSingle,
    unsubscribe,
    emitir: (evento: string, s: Sessao | null) =>
      act(() => callback(evento, s)),
    travar: () => {
      let liberar!: () => void;
      gate = new Promise<void>((r) => (liberar = r));
      return () => {
        gate = null;
        liberar();
      };
    },
  };
}

const sessao: Sessao = { user: { id: "u1", email: "pessoa@exemplo.test" } };
const linhaAtiva: Linha = {
  email: "pessoa@exemplo.test",
  papel: "admin",
  ativo: true,
};

function montar(f: ReturnType<typeof fakeClient>) {
  mockedGetSupabase.mockReturnValue(f.client as never);
  return renderHook(() => useAcesso());
}

describe("useAcesso", () => {
  beforeEach(() => {
    mockedGetSupabase.mockReset();
  });
  afterEach(cleanup);

  it("sem variáveis → nao-configurado", async () => {
    mockedGetSupabase.mockReturnValue(null);
    const { result } = renderHook(() => useAcesso());
    await waitFor(() => expect(result.current.estado).toBe("nao-configurado"));
  });

  it("sem sessão → sem-sessao", async () => {
    const f = fakeClient({ session: null });
    const { result } = montar(f);
    await waitFor(() => expect(result.current.estado).toBe("sem-sessao"));
    expect(f.maybeSingle).not.toHaveBeenCalled();
  });

  it("sessão mas sem linha em membros → sem-acesso", async () => {
    const { result } = montar(fakeClient({ session: sessao, rows: [] }));
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
  });

  it("sessão e linha ativa → ok, com o papel", async () => {
    const { result } = montar(fakeClient({ session: sessao, rows: [linhaAtiva] }));
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    expect(result.current.papel).toBe("admin");
    expect(result.current.email).toBe("pessoa@exemplo.test");
  });

  it("linha com ativo=false → sem-acesso", async () => {
    const { result } = montar(
      fakeClient({
        session: sessao,
        rows: [{ ...linhaAtiva, papel: "membro", ativo: false }],
      }),
    );
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
    expect(result.current.papel).toBeUndefined();
  });

  it("enquanto carrega → carregando, nunca ok", async () => {
    const f = fakeClient({ session: "pendente" });
    const { result, unmount } = montar(f);
    expect(result.current.estado).toBe("carregando");
    await Promise.resolve();
    expect(result.current.estado).toBe("carregando");
    unmount();
    expect(f.unsubscribe).toHaveBeenCalled();
  });

  it("admin com várias linhas visíveis → ok, filtrando pelo próprio e-mail normalizado", async () => {
    const f = fakeClient({
      session: { user: { id: "u1", email: " Pessoa@Exemplo.test " } },
      rows: [
        linhaAtiva,
        { email: "outra@exemplo.test", papel: "membro", ativo: true },
      ],
    });
    const { result } = montar(f);
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    expect(result.current.papel).toBe("admin");
    expect(f.eq).toHaveBeenCalledWith("email", "pessoa@exemplo.test");
  });

  it("sessão sem e-mail → sem-acesso, sem consultar", async () => {
    const f = fakeClient({
      session: { user: { id: "u1" } } as never,
      rows: [linhaAtiva],
    });
    const { result } = montar(f);
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
    expect(f.maybeSingle).not.toHaveBeenCalled();
  });

  it("erro na consulta → sem-acesso", async () => {
    const { result } = montar(
      fakeClient({ session: sessao, rows: [linhaAtiva], erro: true }),
    );
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
  });

  it("consulta rejeitada → sem-acesso", async () => {
    const { result } = montar(
      fakeClient({ session: sessao, rows: [linhaAtiva], rejeita: true }),
    );
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
  });

  it("getSession rejeitado → sem-acesso", async () => {
    const { result } = montar(
      fakeClient({ session: sessao, getSessionRejeita: true }),
    );
    await waitFor(() => expect(result.current.estado).toBe("sem-acesso"));
  });

  it("logout depois de ok → sem-sessao", async () => {
    const f = fakeClient({ session: sessao, rows: [linhaAtiva] });
    const { result } = montar(f);
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    f.emitir("SIGNED_OUT", null);
    expect(result.current.estado).toBe("sem-sessao");
    expect(result.current.papel).toBeUndefined();
  });

  it("troca de usuário → passa por carregando, nunca mostra o ok anterior", async () => {
    const outra: Linha = {
      email: "outra@exemplo.test",
      papel: "membro",
      ativo: true,
    };
    const f = fakeClient({ session: sessao, rows: [linhaAtiva, outra] });
    const { result } = montar(f);
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    const liberar = f.travar();
    f.emitir("SIGNED_IN", { user: { id: "u2", email: outra.email } });
    expect(result.current.estado).toBe("carregando");
    expect(result.current.email).toBeUndefined();
    liberar();
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    expect(result.current.email).toBe(outra.email);
    expect(result.current.papel).toBe("membro");
  });

  it("renovação de token do mesmo usuário → mantém ok, sem carregando", async () => {
    const f = fakeClient({ session: sessao, rows: [linhaAtiva] });
    const { result } = montar(f);
    await waitFor(() => expect(result.current.estado).toBe("ok"));
    const liberar = f.travar();
    f.emitir("TOKEN_REFRESHED", sessao);
    expect(result.current.estado).toBe("ok");
    liberar();
    await waitFor(() => expect(f.maybeSingle).toHaveBeenCalledTimes(2));
    expect(result.current.estado).toBe("ok");
  });
});
