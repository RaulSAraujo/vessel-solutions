import { getSupabaseClientAndUser } from "../../utils/supabase";
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from "../../types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);
    const clientId = event.context.params?.id;
    const body = await readBody<TablesUpdate<"clients">>(event);

    if (!clientId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Client ID is required.",
      });
    }

    const { data, error } = await client
      .from("clients")
      .update(body)
      .eq("id", clientId)
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update client",
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: `Client with ID ${clientId} not found or not accessible for update.`,
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
