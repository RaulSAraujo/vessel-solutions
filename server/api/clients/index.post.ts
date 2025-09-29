import { getSupabaseClientAndUser } from "../../utils/supabase";

import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "../../types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    const body = await readBody<TablesInsert<"clients">>(event);

    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Client name and email are required.",
      });
    }

    const { data, error } = await client.from("clients").insert(body).select(); // Return the inserted record

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create client",
        message: error.message,
      });
    }

    return data[0] as Tables<"clients">;
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});
