// Valida as duas variáveis públicas do Supabase ANTES do build e só repassa ao build
// o que for seguro. Motivo: tudo que começa com NEXT_PUBLIC_ é gravado em texto puro no
// JavaScript do site. Uma chave secreta colada na variável errada ficaria pública.
//
// Uso (no workflow): URL=... KEY=... GITHUB_ENV=... node scripts/preparar-env-supabase.mjs
// Se qualquer valor for inválido, NENHUM dos dois é repassado: o site sobe sem configuração
// ("Painel ainda não configurado") e o aviso explica o motivo, sem imprimir o valor.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const URL_PROJETO = /^https:\/\/[a-z0-9]{20}\.supabase\.co$/;
const PUBLISHABLE = /^sb_publishable_[A-Za-z0-9_-]{20,}$/;
const SECRETA = /^sb_secret_/;

function papelDoJwt(valor) {
  const partes = valor.split(".");
  if (partes.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(partes[1], "base64url").toString("utf8")).role ?? null;
  } catch {
    return null;
  }
}

function classificarChave(valor) {
  if (SECRETA.test(valor)) return "secreta";
  if (PUBLISHABLE.test(valor)) return "publica";
  if (valor.startsWith("eyJ")) {
    const papel = papelDoJwt(valor);
    if (papel === "anon") return "publica";
    if (papel === "service_role") return "secreta";
  }
  return "desconhecida";
}

// Retorna { ok, url, key, avisos }. Os avisos nunca contêm o valor recebido.
export function validarEnvSupabase({ url = "", key = "" } = {}) {
  const u = String(url ?? "").trim();
  const k = String(key ?? "").trim();
  const nenhum = { ok: false, url: "", key: "" };

  if (!u && !k) return { ...nenhum, avisos: [] };

  const avisos = [];
  if (!u) avisos.push("NEXT_PUBLIC_SUPABASE_URL está vazia");
  if (!k) avisos.push("NEXT_PUBLIC_SUPABASE_ANON_KEY está vazia");

  if (u && !URL_PROJETO.test(u)) {
    avisos.push("NEXT_PUBLIC_SUPABASE_URL não é uma URL de projeto (https://<20 caracteres>.supabase.co)");
  }
  if (k) {
    const tipo = classificarChave(k);
    if (tipo === "secreta") {
      avisos.push("NEXT_PUBLIC_SUPABASE_ANON_KEY contém uma chave SECRETA do Supabase; use a Publishable key");
    } else if (tipo === "desconhecida") {
      avisos.push("NEXT_PUBLIC_SUPABASE_ANON_KEY não parece uma Publishable key (sb_publishable_...)");
    }
  }

  if (avisos.length) return { ...nenhum, avisos };
  return { ok: true, url: u, key: k, avisos: [] };
}

function executar() {
  const r = validarEnvSupabase({ url: process.env.URL, key: process.env.KEY });
  for (const aviso of r.avisos) console.log(`::warning title=Supabase::${aviso}. O site será publicado SEM configuração do painel.`);
  if (r.ok) {
    console.log("Variáveis públicas do Supabase válidas: repassadas ao build.");
    if (process.env.GITHUB_ENV) {
      fs.appendFileSync(
        process.env.GITHUB_ENV,
        `NEXT_PUBLIC_SUPABASE_URL=${r.url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${r.key}\n`,
      );
    }
  } else if (!r.avisos.length) {
    console.log("Variáveis do Supabase não definidas: o painel ficará como 'não configurado'.");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) executar();
