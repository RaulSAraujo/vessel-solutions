import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import type { Tables } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  try {
    const { client } = await getSupabaseClientAndUser(event);

    const { data, error } = await client
      .from("clients")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch clients",
        message: error.message,
      });
    }

    return data as Tables<"clients">[];
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});
