import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const costId = event.context.params?.costId;

        if (!eventId || !costId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event ID and Additional Cost ID are required.',
            });
        }

        const { error } = await client
            .from('event_additional_costs')
            .delete()
            .eq('id', costId)
            .eq('event_id', eventId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete additional cost',
                message: error.message,
            });
        }

        return { message: `Additional cost ${costId} for event ${eventId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});