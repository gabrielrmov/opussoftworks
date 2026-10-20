import { ErroDeValidacao, exigirCliente as cliente, mensagemDeErro } from "@/lib/painel/erros";

export { ErroDeValidacao, mensagemDeErro };

export type Papel = "admin" | "membro";
export type Membro = { id: string; email: string; papel: Papel; ativo: boolean };

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function listarMembros(): Promise<Membro[]> {
  const { data, error } = await cliente().from("membros").select("id, email, papel, ativo").order("email");
  if (error) throw error;
  return (data ?? []) as Membro[];
}

export async function adicionarMembro(email: string, papel: Papel): Promise<void> {
  const limpo = email.trim().toLowerCase();
  if (!EMAIL_VALIDO.test(limpo)) throw new ErroDeValidacao("Informe um e-mail válido.");
  const { error } = await cliente().from("membros").insert({ email: limpo, papel });
  if (error) throw error;
}

export async function definirAtivo(id: string, ativo: boolean): Promise<void> {
  const { data, error } = await cliente().from("membros").update({ ativo }).eq("id", id).select("id");
  if (error) throw error;
  // RLS filtrando a linha (ou id inexistente) devolve sucesso com 0 linhas.
  if (!data || data.length === 0) throw { code: "42501", message: "nenhuma linha afetada" };
}
