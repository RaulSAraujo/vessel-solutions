import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const listId = event.context.params?.id;

        if (!listId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Purchase List ID is required.',
            });
        }

        const { error } = await client
            .from('purchase_lists')
            .delete()
            .eq('id', listId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete purchase list',
                message: error.message,
            });
        }

        return { message: `Purchase List ${listId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});