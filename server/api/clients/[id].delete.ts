import { getSupabaseClientAndUser } from "../../utils/supabase";
import type { FetchError } from "ofetch";

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

    const { error } = await client.from("clients").delete().eq("id", clientId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete client",
        message: error.message,
      });
    }

    return { message: `Client ${clientId} deleted successfully.` };
  } catch (error: unknown) {
    const err = error as FetchError;

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal Server Error",
      message: err.message,
    });
  }
});
