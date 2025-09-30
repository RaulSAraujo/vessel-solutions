import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const purchaseListId = event.context.params?.id;
        const itemId = event.context.params?.itemId;

        if (!purchaseListId || !itemId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Purchase List ID and Item ID are required.',
            });
        }

        const { error } = await client
            .from('purchase_list_items')
            .delete()
            .eq('id', itemId)
            .eq('purchase_list_id', purchaseListId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete purchase list item',
                message: error.message,
            });
        }

        return { message: `Purchase list item ${itemId} from list ${purchaseListId} deleted successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});