import { describe, expect, it } from "vitest";
import { validarEnvSupabase } from "@/scripts/preparar-env-supabase.mjs";

// Valores fictícios: nenhuma chave real aparece em testes.
const URL_OK = "https://abcdefghijklmnopqrst.supabase.co";
const PUBLISHABLE = "sb_publishable_" + "A1b2C3d4E5f6G7h8I9j0K1_-L2m3N4o";
const SECRETA = "sb_secret_" + "A1b2C3d4E5f6G7h8I9j0K1_-L2m3N4o";

function jwt(role: string) {
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ role, iss: "supabase" })}.assinaturafake123456`;
}

describe("validarEnvSupabase", () => {
  it("aceita URL do projeto + chave publishable", () => {
    const r = validarEnvSupabase({ url: URL_OK, key: PUBLISHABLE });
    expect(r.ok).toBe(true);
    expect(r.url).toBe(URL_OK);
    expect(r.key).toBe(PUBLISHABLE);
    expect(r.avisos).toEqual([]);
  });

  it("aceita a chave anon legada (JWT com role anon)", () => {
    const r = validarEnvSupabase({ url: URL_OK, key: jwt("anon") });
    expect(r.ok).toBe(true);
  });

  it("recusa chave secreta sb_secret_ e não devolve o valor", () => {
    const r = validarEnvSupabase({ url: URL_OK, key: SECRETA });
    expect(r.ok).toBe(false);
    expect(r.url).toBe("");
    expect(r.key).toBe("");
    expect(r.avisos.join(" ")).toMatch(/secreta/i);
    expect(r.avisos.join(" ")).not.toContain(SECRETA);
  });

  it("recusa JWT legado com role service_role", () => {
    const r = validarEnvSupabase({ url: URL_OK, key: jwt("service_role") });
    expect(r.ok).toBe(false);
    expect(r.key).toBe("");
  });

  it("recusa valores trocados (chave na variável da URL)", () => {
    const r = validarEnvSupabase({ url: PUBLISHABLE, key: SECRETA });
    expect(r.ok).toBe(false);
    expect(r.url).toBe("");
    expect(r.key).toBe("");
  });

  it("recusa URL que não é de um projeto Supabase", () => {
    expect(validarEnvSupabase({ url: "https://exemplo.com", key: PUBLISHABLE }).ok).toBe(false);
    expect(validarEnvSupabase({ url: "http://abcdefghijklmnopqrst.supabase.co", key: PUBLISHABLE }).ok).toBe(false);
  });

  it("variáveis ausentes não são erro: publica sem configuração, sem aviso", () => {
    const r = validarEnvSupabase({ url: "", key: "" });
    expect(r.ok).toBe(false);
    expect(r.url).toBe("");
    expect(r.key).toBe("");
    expect(r.avisos).toEqual([]);
  });

  it("só um dos dois preenchidos: publica nenhum e avisa", () => {
    const r = validarEnvSupabase({ url: URL_OK, key: "" });
    expect(r.ok).toBe(false);
    expect(r.url).toBe("");
    expect(r.avisos.length).toBeGreaterThan(0);
  });

  it("ignora espaços e quebras de linha em volta do valor", () => {
    const r = validarEnvSupabase({ url: ` ${URL_OK}\n`, key: `${PUBLISHABLE} ` });
    expect(r.ok).toBe(true);
    expect(r.url).toBe(URL_OK);
  });

  it("aceita a URL com barra no final e a devolve sem a barra", () => {
    const r = validarEnvSupabase({ url: `${URL_OK}/`, key: PUBLISHABLE });
    expect(r.ok).toBe(true);
    expect(r.url).toBe(URL_OK);
  });

  it("URL recusada: o aviso diz o que está diferente, sem imprimir o valor", () => {
    const comCaminho = `${URL_OK}/rest/v1/`;
    const r = validarEnvSupabase({ url: comCaminho, key: PUBLISHABLE });
    expect(r.ok).toBe(false);
    const aviso = r.avisos.join(" ");
    expect(aviso).toMatch(/caminho/i);
    expect(aviso).not.toContain("rest/v1");
    expect(aviso).not.toContain("abcdefghijklmnopqrst");

    const painel = validarEnvSupabase({ url: "https://supabase.com/dashboard/project/abcdefghijklmnopqrst", key: PUBLISHABLE });
    expect(painel.avisos.join(" ")).toMatch(/não termina em \.supabase\.co/i);

    const curto = validarEnvSupabase({ url: "https://abc.supabase.co", key: PUBLISHABLE });
    expect(curto.avisos.join(" ")).toMatch(/3 caracteres/);
  });
});
