import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import { applySupabaseFilters } from "~~/server/utils/applyFilters";
import type { FetchError } from "ofetch";
import type { Tables } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    const query = getQuery(event); // Obtém os parâmetros da query string

    const page = parseInt(query.page as string) || 1; // Página atual, padrão 1
    const itemsPerPage = parseInt(query.itemsPerPage as string) || 10; // Itens por página, padrão 10
    const offset = (page - 1) * itemsPerPage; // Calcula o offset

    let supabaseQuery = client
      .from("clients")
      .select("*", { count: "exact" });

    if (query.filters && typeof query.filters === "string") {
      try {
        const filters = JSON.parse(query.filters);

        supabaseQuery = applySupabaseFilters(supabaseQuery, filters);
      } catch (jsonError) {
        console.error("Failed to parse filters JSON:", jsonError);
        throw createError({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: "Invalid 'filters' parameter format. Must be a valid JSON string.",
        });
      }
    }

    const { data, error, count } = await supabaseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + itemsPerPage - 1);

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
        itemsPerPage,
        totalRows: count,
        totalPages: Math.ceil((count || 0) / itemsPerPage),
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
