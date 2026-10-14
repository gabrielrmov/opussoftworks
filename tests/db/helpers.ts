import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const MIGRATIONS = join(process.cwd(), "supabase", "migrations");

// Cria um banco em memória com o mínimo do Supabase (roles e auth.jwt())
// e aplica as migrações em ordem.
export async function novoBanco(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role supabase_auth_admin nologin;
    create schema auth;
    create function auth.jwt() returns jsonb language sql stable as
      $$ select nullif(current_setting('request.jwt.claims', true), '')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    grant usage on schema public to anon, authenticated;
    alter default privileges in schema public
      grant all on tables to anon, authenticated;
    -- Como no Supabase: funcoes novas ja nascem executaveis por anon/authenticated.
    alter default privileges in schema public
      grant execute on functions to anon, authenticated;
  `);
  const arquivos = readdirSync(MIGRATIONS)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const arquivo of arquivos) {
    await db.exec(readFileSync(join(MIGRATIONS, arquivo), "utf8"));
  }
  return db;
}

// Passa a agir como um usuário autenticado (ou anon, se email for null).
export async function comoUsuario(db: PGlite, email: string | null): Promise<void> {
  await comoAdminDoBanco(db);
  if (email === null) {
    await db.exec("set role anon");
    return;
  }
  const claims = JSON.stringify({ email, role: "authenticated" });
  await db.query("select set_config('request.jwt.claims', $1, false)", [claims]);
  await db.exec("set role authenticated");
}

// Volta ao superusuário (para preparar dados).
export async function comoAdminDoBanco(db: PGlite): Promise<void> {
  await db.exec("reset role");
  await db.exec("reset request.jwt.claims");
}
