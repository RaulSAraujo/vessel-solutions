// server/api/purchase-lists/[id].put.ts
import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const listId = event.context.params?.id;
        const body = await readBody<TablesUpdate<'purchase_lists'>>(event);

        if (!listId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Purchase List ID is required.',
            });
        }

        const { data, error } = await client
            .from('purchase_lists')
            .update(body)
            .eq('id', listId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update purchase list',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Purchase List with ID ${listId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'purchase_lists'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});