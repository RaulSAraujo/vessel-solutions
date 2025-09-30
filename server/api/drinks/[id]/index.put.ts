import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const body = await readBody<TablesUpdate<'drinks'>>(event);

        if (!drinkId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Drink ID is required.',
            });
        }

        // Note: calculated_unit_cost is updated via recipe endpoints, not directly here.
        const { calculated_unit_cost, ...updateBody } = body; // Exclude calculated_unit_cost from direct update

        const { data, error } = await client
            .from('drinks')
            .update(updateBody)
            .eq('id', drinkId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update drink',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Drink with ID ${drinkId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'drinks'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});