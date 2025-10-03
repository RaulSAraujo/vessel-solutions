import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import type { Tables } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    const query = getQuery(event); // Obtém os parâmetros da query string

    const page = parseInt(query.page as string) || 1; // Página atual, padrão 1
    const limit = parseInt(query.limit as string) || 10; // Itens por página, padrão 10

    const offset = (page - 1) * limit; // Calcula o offset

    const { data, error, count } = await client
      .from("clients")
      .select("*", { count: "exact" })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch clients",
        message: error.message,
      });
    }

    return {
      data: data as Tables<"clients">[],
      page: {
        page,
        limit,
        totalRows: count,
        totalPages: Math.ceil((count || 0) / limit),
      }
    };
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});
