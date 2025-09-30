import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { convertUnits } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const purchaseListId = event.context.params?.id;
        const itemId = event.context.params?.itemId;
        const body = await readBody<TablesUpdate<'purchase_list_items'>>(event);

        if (!purchaseListId || !itemId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Purchase List ID and Item ID are required.',
            });
        }

        const updatedFields: TablesUpdate<'purchase_list_items'> = { ...body };

        // Recalculate suggested_total_batches if relevant fields change
        if (body.required_quantity !== undefined || body.required_unit !== undefined || body.suggested_batch_size !== undefined) {
            const { data: currentItem, error: fetchItemError } = await client
                .from('purchase_list_items')
                .select('ingredient_id, required_quantity, required_unit, suggested_batch_size')
                .eq('id', itemId)
                .eq('purchase_list_id', purchaseListId)
                .single();

            if (fetchItemError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to fetch current purchase list item for recalculation',
                    message: fetchItemError.message,
                });
            }

            const { data: ingredientDetails, error: fetchIngredientError } = await client
                .from('ingredients')
                .select('base_purchase_unit')
                .eq('id', currentItem.ingredient_id)
                .single();

            if (fetchIngredientError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to fetch ingredient details for recalculation',
                    message: fetchIngredientError.message,
                });
            }

            const required_quantity = body.required_quantity ?? currentItem.required_quantity;
            const required_unit = body.required_unit ?? currentItem.required_unit;
            const suggested_batch_size = body.suggested_batch_size ?? currentItem.suggested_batch_size;

            const convertedRequiredQuantity = convertUnits(
                required_quantity,
                required_unit,
                ingredientDetails.base_purchase_unit
            );

            if (suggested_batch_size && suggested_batch_size > 0) {
                updatedFields.suggested_total_batches = Math.ceil(convertedRequiredQuantity / suggested_batch_size);
            } else {
                updatedFields.suggested_total_batches = null;
            }
        }

        const { data, error } = await client
            .from('purchase_list_items')
            .update(updatedFields)
            .eq('id', itemId)
            .eq('purchase_list_id', purchaseListId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update purchase list item',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Purchase list item with ID ${itemId} for list ${purchaseListId} not found or not accessible.`,
            });
        }

        return data[0] as Tables<'purchase_list_items'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});