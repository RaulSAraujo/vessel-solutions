import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);
    const body = await readBody<TablesInsert<"drinks">>(event);

    if (!body.name || !body.type) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Drink name and type are required.",
      });
    }

    // Inicialmente, o custo unitário calculado é 0. Será atualizado ao adicionar ingredientes.
    const { data, error } = await client
      .from("drinks")
      .insert({
        ...body,
        calculated_unit_cost: 0, // Default initial value
        user_id: user.id,
      })
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create drink",
        message: error.message,
      });
    }

    return data[0] as Tables<"drinks">;
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});
