import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch"
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const ingredientId = event.context.params?.id;

        if (!ingredientId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Ingredient ID is required.',
            });
        }

        const { data, error } = await client
            .from('ingredients')
            .select('*')
            .eq('id', ingredientId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    message: `Ingredient with ID ${ingredientId} not found or not accessible.`,
                });
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch ingredient',
                message: error.message,
            });
        }

        return data as Tables<'ingredients'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});