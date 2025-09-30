import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import type { Tables } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    const clientId = event.context.params?.id;

    if (!clientId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Client ID is required.",
      });
    }

    const { data, error } = await client
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single(); // Expect a single record

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        throw createError({
          statusCode: 404,
          statusMessage: "Not Found",
          message: `Client with ID ${clientId} not found or not accessible.`,
        });
      }
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch client",
        message: error.message,
      });
    }

    return data as Tables<"clients">;
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});
