import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch'

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const { data: eventsData, error } = await client
            .from('events')
            .select('*')
            .eq('user_id', user.id)


        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch monthly events data',
                message: error.message,
            });
        }

        return eventsData;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        });
    }
});