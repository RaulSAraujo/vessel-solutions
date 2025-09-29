import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { H3Event } from "h3";
import type { Database } from "../types/database";

/**
 * Obtém o cliente Supabase e o usuário autenticado para uma rota Nitro.
 * Lança um erro 401 se o usuário não estiver autenticado.
 */
export async function getSupabaseClientAndUser(event: H3Event) {
  const client = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required. Please log in.",
    });
  }
  return { client, user };
}
