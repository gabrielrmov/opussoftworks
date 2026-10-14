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
      ('beto@x.com', 'membro', true),
      ('caio@x.com', 'membro', false);
  `);
});

async function linhas() {
  const r = await db.query<{ email: string }>("select email from membros");
  return r.rows;
}

describe("RLS de membros", () => {
  it("admin lê todos os membros", async () => {
    await comoUsuario(db, "ana@x.com");
    const r = await db.query<{ count: number }>("select count(*)::int as count from membros");
    expect(r.rows[0].count).toBe(3);
  });

  it("membro lê só a própria linha", async () => {
    await comoUsuario(db, "beto@x.com");
    const rows = await linhas();
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe("beto@x.com");
  });

  it("e-mail fora da lista não lê nada", async () => {
    await comoUsuario(db, "zeca@x.com");
    expect(await linhas()).toHaveLength(0);
  });

  it("anon não lê nem escreve", async () => {
    await comoUsuario(db, null);
    expect(await linhas()).toHaveLength(0);
    await expect(
      db.exec("insert into membros (email, papel) values ('x@x.com', 'admin')"),
    ).rejects.toThrow();
  });

  it("e-mail com caixa diferente é reconhecido", async () => {
    await comoUsuario(db, "Beto@X.com");
    expect(await linhas()).toHaveLength(1);
  });

  it("membro revogado perde o acesso", async () => {
    await comoUsuario(db, "caio@x.com");
    expect(await linhas()).toHaveLength(0);
  });

  it("membro não se promove nem autoriza outros", async () => {
    await comoUsuario(db, "beto@x.com");
    const up = await db.query("update membros set papel='admin' where email='beto@x.com'");
    expect(up.affectedRows).toBe(0);
    await expect(
      db.exec("insert into membros (email, papel) values ('novo@x.com', 'membro')"),
    ).rejects.toThrow();
  });

  it("admin adiciona e revoga", async () => {
    await comoUsuario(db, "ana@x.com");
    const ins = await db.query("insert into membros (email, papel) values ('dani@x.com', 'membro')");
    expect(ins.affectedRows).toBe(1);
    const up = await db.query("update membros set ativo=false where email='dani@x.com'");
    expect(up.affectedRows).toBe(1);
    const r = await db.query<{ ativo: boolean }>("select ativo from membros where email='dani@x.com'");
    expect(r.rows[0].ativo).toBe(false);
  });
});
