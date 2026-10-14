import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClient = vi.fn(() => ({}));
vi.mock("@supabase/supabase-js", () => ({ createClient }));

describe("getSupabase", () => {
  beforeEach(() => {
    vi.resetModules();
    createClient.mockClear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("cria o cliente com fluxo PKCE", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-teste");
    const { getSupabase } = await import("@/lib/supabase/client");
    expect(getSupabase()).not.toBeNull();
    expect(createClient).toHaveBeenCalledWith("https://exemplo.supabase.co", "anon-teste", {
      auth: { flowType: "pkce" },
    });
  });

  it("retorna null sem variáveis", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const { getSupabase } = await import("@/lib/supabase/client");
    expect(getSupabase()).toBeNull();
    expect(createClient).not.toHaveBeenCalled();
  });
});
