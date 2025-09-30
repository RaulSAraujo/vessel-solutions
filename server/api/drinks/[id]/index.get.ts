import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;

        if (!drinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Drink ID is required.',
            });
        }

        const { data, error } = await client
            .from('drinks')
            .select('*')
            .eq('id', drinkId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    message: `Drink with ID ${drinkId} not found or not accessible.`,
                });
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch drink',
                message: error.message,
            });
        }

        return data as Tables<'drinks'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});