import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const servedDrinkId = event.context.params?.servedDrinkId;

        if (!eventId || !servedDrinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event ID and Served Drink ID are required.',
            });
        }

        const { error } = await client
            .from('event_served_drinks')
            .delete()
            .eq('id', servedDrinkId)
            .eq('event_id', eventId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete served drink',
                message: error.message,
            });
        }

        return { message: `Served drink ${servedDrinkId} for event ${eventId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});