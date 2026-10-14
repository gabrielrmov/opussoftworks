import type { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { comoAdminDoBanco, comoUsuario, novoBanco } from "./helpers";

let db: PGlite;

beforeEach(async () => {
  db = await novoBanco();
  await comoAdminDoBanco(db);
  await db.exec(`
    insert into membros (email, papel) values
      ('ana@x.com', 'admin'), ('beto@x.com', 'membro');
  `);
});

describe("privilegios de membros", () => {
  it("admin autenticado não executa truncate", async () => {
    await comoUsuario(db, "ana@x.com");
    await expect(db.exec("truncate membros")).rejects.toThrow(/permission denied/);
  });

  it("anon não lê membros (permission denied, não 0 linhas)", async () => {
    await comoUsuario(db, null);
    await expect(db.query("select * from membros")).rejects.toThrow(/permission denied/);
  });

  it("fluxos do admin autenticado seguem funcionando", async () => {
    await comoUsuario(db, "ana@x.com");
    const sel = await db.query("select * from membros");
    expect(sel.rows).toHaveLength(2);
    expect((await db.query("insert into membros (email, papel) values ('dani@x.com','membro')")).affectedRows).toBe(1);
    expect((await db.query("update membros set ativo=false where email='dani@x.com'")).affectedRows).toBe(1);
    expect((await db.query("delete from membros where email='dani@x.com'")).affectedRows).toBe(1);
  });
});
