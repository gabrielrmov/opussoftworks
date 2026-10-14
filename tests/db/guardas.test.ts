import type { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { comoAdminDoBanco, comoUsuario, novoBanco } from "./helpers";

let db: PGlite;

beforeEach(async () => {
  db = await novoBanco();
  await comoAdminDoBanco(db);
  await db.exec(`
    insert into membros (email, papel, ativo) values
      ('ana@x.com', 'admin', true),
      ('beto@x.com', 'membro', true);
  `);
});

async function hook(email: string | null) {
  const evento = JSON.stringify({ user: email === null ? {} : { email } });
  const r = await db.query<{ r: unknown }>("select public.hook_bloquear_cadastro($1::jsonb) as r", [
    evento,
  ]);
  return r.rows[0].r;
}

const BLOQUEIO = { error: { message: "Acesso restrito.", http_code: 403 } };

describe("guarda do ultimo admin", () => {
  it("não permite desativar o último admin", async () => {
    await expect(db.exec("update membros set ativo=false where email='ana@x.com'")).rejects.toThrow(
      /ultimo admin/,
    );
  });

  it("não permite rebaixar o último admin", async () => {
    await expect(db.exec("update membros set papel='membro' where email='ana@x.com'")).rejects.toThrow(
      /ultimo admin/,
    );
  });

  it("não permite remover o último admin", async () => {
    await expect(db.exec("delete from membros where email='ana@x.com'")).rejects.toThrow(/ultimo admin/);
  });

  it("não deixa zerar os admins num único comando", async () => {
    await db.exec("update membros set papel='admin' where email='beto@x.com'");
    await expect(db.exec("update membros set ativo=false where papel='admin'")).rejects.toThrow(
      /ultimo admin/,
    );
  });

  it("vale também para o admin agindo pelo RLS", async () => {
    await comoUsuario(db, "ana@x.com");
    await expect(db.exec("update membros set ativo=false where email='ana@x.com'")).rejects.toThrow(
      /ultimo admin/,
    );
  });

  it("permite desativar um admin quando há outro", async () => {
    await db.exec("insert into membros (email, papel) values ('caio@x.com', 'admin')");
    await comoUsuario(db, "ana@x.com");
    const r = await db.query("update membros set ativo=false where email='caio@x.com'");
    expect(r.affectedRows).toBe(1);
  });

  it("permite remover membro comum", async () => {
    const r = await db.query("delete from membros where email='beto@x.com'");
    expect(r.affectedRows).toBe(1);
  });
});

describe("hook de cadastro", () => {
  it("hook libera e-mail autorizado, em qualquer caixa", async () => {
    expect(await hook("ANA@x.com")).toEqual({});
    expect(await hook("  ana@x.com ")).toEqual({});
  });

  it("hook bloqueia e-mail fora da lista ou revogado", async () => {
    await db.exec("update membros set ativo=false where email='beto@x.com'");
    expect(await hook("zeca@x.com")).toEqual(BLOQUEIO);
    expect(await hook("beto@x.com")).toEqual(BLOQUEIO);
  });

  it("hook bloqueia quando não há e-mail", async () => {
    expect(await hook(null)).toEqual(BLOQUEIO);
    expect(await db.query("select public.hook_bloquear_cadastro('{}'::jsonb) as r")).toMatchObject({
      rows: [{ r: BLOQUEIO }],
    });
  });

  it("só supabase_auth_admin executa o hook", async () => {
    await db.exec("set role supabase_auth_admin");
    expect(await hook("ana@x.com")).toEqual({});
    for (const quem of [null, "ana@x.com"]) {
      await comoUsuario(db, quem);
      await expect(hook("ana@x.com")).rejects.toThrow(/permission denied/);
    }
  });
});

describe("permissoes de funcoes", () => {
  it("anon não executa eh_admin nem eh_membro", async () => {
    await comoUsuario(db, null);
    await expect(db.query("select public.eh_admin()")).rejects.toThrow(/permission denied/);
    await expect(db.query("select public.eh_membro()")).rejects.toThrow(/permission denied/);
  });

  it("authenticated continua executando eh_admin", async () => {
    await comoUsuario(db, "ana@x.com");
    const r = await db.query<{ eh_admin: boolean }>("select public.eh_admin()");
    expect(r.rows[0].eh_admin).toBe(true);
  });
});

describe("e-mail normalizado", () => {
  it("rejeita e-mail com espaço ou maiúscula", async () => {
    await comoUsuario(db, "ana@x.com");
    await expect(
      db.exec("insert into membros (email, papel) values (' dani@x.com', 'membro')"),
    ).rejects.toThrow(/membros_email_normalizado/);
    await expect(
      db.exec("insert into membros (email, papel) values ('Dani@X.com', 'membro')"),
    ).rejects.toThrow(/membros_email_normalizado/);
  });

  it("aceita e-mail normalizado", async () => {
    await comoUsuario(db, "ana@x.com");
    const r = await db.query("insert into membros (email, papel) values ('dani@x.com', 'membro')");
    expect(r.affectedRows).toBe(1);
  });
});
