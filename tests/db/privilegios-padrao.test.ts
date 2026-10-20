import type { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { comoAdminDoBanco, novoBanco } from "./helpers";

let db: PGlite;

beforeEach(async () => {
  db = await novoBanco();
  await comoAdminDoBanco(db);
});

async function tem(papel: string, tabela: string, privilegio: string): Promise<boolean> {
  const r = await db.query<{ ok: boolean }>("select has_table_privilege($1, $2, $3) as ok", [
    papel,
    tabela,
    privilegio,
  ]);
  return r.rows[0].ok;
}

describe("privilégios padrão (0004)", () => {
  it("tabela criada depois da 0004 nasce sem truncate/references/trigger para authenticated", async () => {
    await db.exec("create table public.qualquer (id int)");
    expect(await tem("authenticated", "public.qualquer", "TRUNCATE")).toBe(false);
    expect(await tem("authenticated", "public.qualquer", "REFERENCES")).toBe(false);
    expect(await tem("authenticated", "public.qualquer", "TRIGGER")).toBe(false);
    expect(await tem("authenticated", "public.qualquer", "SELECT")).toBe(true);
  });

  it("tabela criada depois da 0004 nasce sem nenhum privilégio para anon", async () => {
    await db.exec("create table public.qualquer (id int)");
    for (const p of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"]) {
      expect(await tem("anon", "public.qualquer", p)).toBe(false);
    }
  });

  it("função criada depois da 0004 não é executável por anon", async () => {
    await db.exec(
      "create function public.qualquer_fn() returns int language sql as $$ select 1 $$",
    );
    const r = await db.query<{ anon: boolean; auth: boolean }>(
      `select has_function_privilege('anon', 'public.qualquer_fn()', 'EXECUTE') as anon,
              has_function_privilege('authenticated', 'public.qualquer_fn()', 'EXECUTE') as auth`,
    );
    expect(r.rows[0].anon).toBe(false);
    expect(r.rows[0].auth).toBe(true);
  });
});
