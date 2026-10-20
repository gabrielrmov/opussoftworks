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

const NOVO = "insert into projetos (nome, cliente, tipo) values ('Site A', 'Cliente A', 'site')";

// Conta como superusuário (ignora o RLS) e devolve ao papel anterior.
async function totalComoSuper(): Promise<number> {
  await comoAdminDoBanco(db);
  const r = await db.query<{ n: number }>("select count(*)::int as n from projetos");
  return r.rows[0].n;
}

describe("RLS de projetos", () => {
  it("anon não lê nem escreve projetos", async () => {
    await comoUsuario(db, null);
    await expect(db.query("select * from projetos")).rejects.toThrow(/permission denied/);
    await expect(db.exec(NOVO)).rejects.toThrow(/permission denied/);
  });

  it("e-mail fora da lista e membro revogado não leem nem escrevem", async () => {
    await comoAdminDoBanco(db);
    await db.exec(NOVO);
    for (const email of ["zeca@x.com", "caio@x.com"]) {
      await comoUsuario(db, email);
      expect((await db.query("select * from projetos")).rows).toHaveLength(0);
      await expect(db.exec(NOVO)).rejects.toThrow(/row-level security/);
      expect((await db.query("update projetos set nome = 'X'")).affectedRows).toBe(0);
    }
    expect(await totalComoSuper()).toBe(1);
  });

  it("membro ativo cria, lê e edita", async () => {
    await comoUsuario(db, "beto@x.com");
    expect((await db.query(NOVO)).affectedRows).toBe(1);
    const sel = await db.query<{ nome: string }>("select nome from projetos");
    expect(sel.rows).toEqual([{ nome: "Site A" }]);
    expect((await db.query("update projetos set status = 'em_andamento'")).affectedRows).toBe(1);
    const r = await db.query<{ status: string }>("select status from projetos");
    expect(r.rows[0].status).toBe("em_andamento");
  });

  it("atualizado_em enviado pelo cliente é sobrescrito", async () => {
    await comoUsuario(db, "beto@x.com");
    await db.exec(NOVO);
    expect(
      (await db.query("update projetos set nome = 'Site B', atualizado_em = '2000-01-01'")).affectedRows,
    ).toBe(1);
    const r = await db.query<{ recente: boolean }>(
      "select atualizado_em > now() - interval '1 hour' as recente from projetos",
    );
    expect(r.rows[0].recente).toBe(true);
  });

  it("criado_em não pode ser alterado por update", async () => {
    await comoUsuario(db, "beto@x.com");
    await db.exec(NOVO);
    const antes = await db.query<{ criado_em: string }>("select criado_em::text from projetos");
    await db.query("update projetos set criado_em = '2000-01-01'");
    const depois = await db.query<{ criado_em: string }>("select criado_em::text from projetos");
    expect(depois.rows[0].criado_em).toBe(antes.rows[0].criado_em);
  });

  it("criado_em e atualizado_em enviados no insert são ignorados", async () => {
    await comoUsuario(db, "beto@x.com");
    await db.exec(`
      insert into projetos (nome, cliente, tipo, criado_em, atualizado_em)
      values ('Site A', 'Cliente A', 'site', '2000-01-01', '2000-01-01')
    `);
    const r = await db.query<{ ok: boolean }>(
      `select criado_em > now() - interval '1 hour'
          and atualizado_em > now() - interval '1 hour' as ok from projetos`,
    );
    expect(r.rows[0].ok).toBe(true);
  });

  it("membro (não superusuário) atribui um responsável com sucesso", async () => {
    await comoAdminDoBanco(db);
    const ana = await db.query<{ id: string }>("select id from membros where email = 'ana@x.com'");
    await comoUsuario(db, "beto@x.com");
    const ins = await db.query(
      "insert into projetos (nome, cliente, tipo, responsavel_id) values ('Site A', 'Cliente A', 'site', $1)",
      [ana.rows[0].id],
    );
    expect(ins.affectedRows).toBe(1);
    const r = await db.query<{ responsavel_id: string }>("select responsavel_id from projetos");
    expect(r.rows).toEqual([{ responsavel_id: ana.rows[0].id }]);
  });

  it("membro revogado no meio da sessão perde a escrita", async () => {
    await comoUsuario(db, "beto@x.com");
    expect((await db.query(NOVO)).affectedRows).toBe(1);
    expect((await db.query("update projetos set nome = 'Antes'")).affectedRows).toBe(1);
    await comoAdminDoBanco(db);
    await db.exec("update membros set ativo = false where email = 'beto@x.com'");
    await comoUsuario(db, "beto@x.com");
    expect((await db.query("update projetos set nome = 'Depois'")).affectedRows).toBe(0);
    await expect(db.exec(NOVO)).rejects.toThrow(/row-level security/);
    await comoAdminDoBanco(db);
    const r = await db.query<{ nome: string }>("select nome from projetos");
    expect(r.rows).toEqual([{ nome: "Antes" }]);
  });

  it("membro comum não apaga: delete afeta 0 linhas e o projeto continua", async () => {
    await comoUsuario(db, "beto@x.com");
    await db.exec(NOVO);
    expect((await db.query("delete from projetos")).affectedRows).toBe(0);
    expect(await totalComoSuper()).toBe(1);
  });

  it("admin apaga", async () => {
    await comoUsuario(db, "ana@x.com");
    await db.exec(NOVO);
    expect((await db.query("delete from projetos")).affectedRows).toBe(1);
    expect(await totalComoSuper()).toBe(0);
  });

  it("truncate negado para authenticated", async () => {
    await comoUsuario(db, "ana@x.com");
    await expect(db.exec("truncate projetos")).rejects.toThrow(/permission denied/);
  });
});

describe("constraints de projetos", () => {
  beforeEach(async () => {
    await comoUsuario(db, "beto@x.com");
  });

  const recusados: Array<[string, string]> = [
    ["tipo inválido", "insert into projetos (nome, cliente, tipo) values ('N', 'C', 'xis')"],
    ["status inválido", "insert into projetos (nome, cliente, tipo, status) values ('N', 'C', 'site', 'xis')"],
    ["nome vazio", "insert into projetos (nome, cliente, tipo) values ('', 'C', 'site')"],
    ["nome só com espaços", "insert into projetos (nome, cliente, tipo) values ('   ', 'C', 'site')"],
    ["nome com 121 caracteres", `insert into projetos (nome, cliente, tipo) values ('${"a".repeat(121)}', 'C', 'site')`],
    ["cliente só com espaços", "insert into projetos (nome, cliente, tipo) values ('N', '   ', 'site')"],
    ["observacoes com 2001 caracteres", `insert into projetos (nome, cliente, tipo, observacoes) values ('N', 'C', 'site', '${"a".repeat(2001)}')`],
  ];

  for (const [nome, sql] of recusados) {
    it(`recusa ${nome}`, async () => {
      await expect(db.exec(sql)).rejects.toThrow(/violates check constraint/);
    });
  }

  it("status padrão é planejado", async () => {
    await db.exec(NOVO);
    const r = await db.query<{ status: string }>("select status from projetos");
    expect(r.rows[0].status).toBe("planejado");
  });

  it("aceita os valores limite (120 e 2000 caracteres)", async () => {
    const r = await db.query(
      `insert into projetos (nome, cliente, tipo, observacoes)
       values ('${"a".repeat(120)}', '${"b".repeat(120)}', 'outro', '${"c".repeat(2000)}')`,
    );
    expect(r.affectedRows).toBe(1);
  });
});

describe("responsável do projeto", () => {
  it("apagar um membro responsável zera responsavel_id e mantém o projeto", async () => {
    await comoAdminDoBanco(db);
    await db.exec(`
      insert into projetos (nome, cliente, tipo, responsavel_id)
      values ('P', 'C', 'site', (select id from membros where email = 'beto@x.com'));
    `);
    await db.exec("delete from membros where email = 'beto@x.com'");
    const r = await db.query<{ responsavel_id: string | null }>("select responsavel_id from projetos");
    expect(r.rows).toEqual([{ responsavel_id: null }]);
  });
});

describe("equipe()", () => {
  it("devolve só membros ativos, ordenados por e-mail, para um membro", async () => {
    await comoUsuario(db, "beto@x.com");
    const r = await db.query<{ email: string; papel: string }>("select email, papel from equipe()");
    expect(r.rows).toEqual([
      { email: "ana@x.com", papel: "admin" },
      { email: "beto@x.com", papel: "membro" },
    ]);
  });

  it("devolve vazio para e-mail fora da lista e para membro revogado", async () => {
    for (const email of ["zeca@x.com", "caio@x.com"]) {
      await comoUsuario(db, email);
      expect((await db.query("select * from equipe()")).rows).toHaveLength(0);
    }
  });

  it("anon não executa equipe()", async () => {
    await comoUsuario(db, null);
    await expect(db.query("select * from equipe()")).rejects.toThrow(/permission denied/);
  });
});
