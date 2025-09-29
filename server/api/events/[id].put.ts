import { getSupabaseClientAndUser } from '../../utils/supabase';

import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "../../types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;

        const body = await readBody<TablesInsert<"events">>(event);

        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event ID is required.',
            });
        }

        // --- Lógica de Negócio no Nitro: Recalcular estimated_total_drinks se campos relevantes mudarem ---
        const updatedFields = { ...body };
        if (
            (body.num_guests !== undefined && body.duration_hours !== undefined && body.public_rating !== undefined) ||
            (body.num_guests !== undefined || body.duration_hours !== undefined || body.public_rating !== undefined)
        ) {
            // Fetch current event data to get missing values for calculation
            const { data: currentEvent, error: fetchError } = await client
                .from('events')
                .select('num_guests, duration_hours, public_rating')
                .eq('id', eventId)
                .single();

            if (fetchError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to fetch current event data for recalculation',
                    message: fetchError.message,
                });
            }

            const num_guests = body.num_guests ?? currentEvent.num_guests;
            const duration_hours = body.duration_hours ?? currentEvent.duration_hours;
            const public_rating = body.public_rating || currentEvent.public_rating || 0;

            const estimated_total_drinks = num_guests * duration_hours * public_rating;

            if (isNaN(estimated_total_drinks)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request',
                    message: 'Invalid numeric values for event calculation.',
                });
            }

            updatedFields.estimated_total_drinks = estimated_total_drinks;
        }

        const { data, error } = await client
            .from('events')
            .update(updatedFields)
            .eq('id', eventId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update event',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Event with ID ${eventId} not found or not accessible for update.`,
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