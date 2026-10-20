import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { comoAdminDoBanco, novoBanco } from "./helpers";

// Guarda da convenção "todo objeto novo revoga": roda depois de TODAS as
// migrações e confere o estado final do schema public. Se uma migration futura
// esquecer um revoke/RLS, o objeto aparece pelo nome na falha.

let db: PGlite;

beforeAll(async () => {
  db = await novoBanco();
  await comoAdminDoBanco(db);
});

async function nomes(sql: string): Promise<string[]> {
  const r = await db.query<{ nome: string }>(sql);
  return r.rows.map((l) => l.nome).sort();
}

const TABELAS_PUBLIC = `
  from pg_class c join pg_namespace n on n.oid = c.relnamespace`;
const SO_TABELAS = "n.nspname = 'public' and c.relkind in ('r', 'p')";

describe("inventário de segurança do schema public", () => {
  it("toda tabela tem RLS ligado e forçado", async () => {
    const ofensores = await nomes(
      `select c.oid::regclass::text as nome ${TABELAS_PUBLIC}
         where ${SO_TABELAS} and not (c.relrowsecurity and c.relforcerowsecurity)`,
    );
    expect(ofensores).toEqual([]);
  });

  it("anon não tem nenhum privilégio em nenhuma tabela", async () => {
    const ofensores = await nomes(
      `select c.oid::regclass::text || ' (' || p || ')' as nome
         ${TABELAS_PUBLIC},
         unnest(array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) as p
         where ${SO_TABELAS} and has_table_privilege('anon', c.oid, p)`,
    );
    expect(ofensores).toEqual([]);
  });

  it("authenticated não tem truncate, references nem trigger em nenhuma tabela", async () => {
    const ofensores = await nomes(
      `select c.oid::regclass::text || ' (' || p || ')' as nome
         ${TABELAS_PUBLIC},
         unnest(array['TRUNCATE','REFERENCES','TRIGGER']) as p
         where ${SO_TABELAS} and has_table_privilege('authenticated', c.oid, p)`,
    );
    expect(ofensores).toEqual([]);
  });

  it("nenhuma função (fora gatilhos) é executável por anon, nem via PUBLIC", async () => {
    const ofensores = await nomes(
      `select p.oid::regprocedure::text as nome
         from pg_proc p join pg_namespace n on n.oid = p.pronamespace
         where n.nspname = 'public'
           and p.prorettype <> 'trigger'::regtype
           and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
           and has_function_privilege('anon', p.oid, 'EXECUTE')`,
    );
    expect(ofensores).toEqual([]);
  });

  it("nenhuma sequência concede usage ou select a anon", async () => {
    const ofensores = await nomes(
      `select c.oid::regclass::text || ' (' || p || ')' as nome
         from pg_class c join pg_namespace n on n.oid = c.relnamespace,
         unnest(array['USAGE','SELECT']) as p
         where n.nspname = 'public' and c.relkind = 'S'
           and has_sequence_privilege('anon', c.oid, p)`,
    );
    expect(ofensores).toEqual([]);
  });
});
