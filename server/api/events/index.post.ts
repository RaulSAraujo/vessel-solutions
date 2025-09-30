import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const body = await readBody<TablesInsert<"events">>(event);

        // Basic validation
        if (
            !body.client_id ||
            !body.event_date ||
            !body.location ||
            !body.num_guests ||
            !body.duration_hours ||
            !body.public_rating
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Missing required event fields.",
            });
        }

        // --- Lógica de Negócio no Nitro: Calcular estimated_total_drinks ---
        const estimated_total_drinks =
            body.num_guests * body.duration_hours * body.public_rating;
        if (isNaN(estimated_total_drinks)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Invalid numeric values for event calculation.",
            });
        }

        const { data, error } = await client
            .from("events")
            .insert({
                ...body,
                estimated_total_drinks, // Adiciona o valor calculado
                user_id: user.id,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create event",
                message: error.message,
            });
        }

        return data[0] as Tables<"events">;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
