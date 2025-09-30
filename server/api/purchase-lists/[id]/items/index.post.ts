import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { convertUnits } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const purchaseListId = event.context.params?.id;
        const body = await readBody<TablesInsert<'purchase_list_items'>>(event);

        if (!purchaseListId || !body.ingredient_id || !body.required_quantity || !body.required_unit) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for purchase list item.',
            });
        }

        // Fetch ingredient details for batch calculation
        const { data: ingredientDetails, error: ingredientError } = await client
            .from('ingredients')
            .select('base_purchase_unit, suggested_batch_size')
            .eq('id', body.ingredient_id)
            .single();

        if (ingredientError) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Ingredient with ID ${body.ingredient_id} not found.`,
            });
        }

        let suggested_batch_size = body.suggested_batch_size ?? ingredientDetails.suggested_batch_size;
        let suggested_total_batches: number | null = null;

        // Convert required quantity to ingredient's base unit for batch calculation
        const convertedRequiredQuantity = convertUnits(
            body.required_quantity,
            body.required_unit,
            ingredientDetails.base_purchase_unit
        );

        if (suggested_batch_size && suggested_batch_size > 0) {
            suggested_total_batches = Math.ceil(convertedRequiredQuantity / suggested_batch_size);
        }

        const { data, error } = await client
            .from('purchase_list_items')
            .insert({
                purchase_list_id: purchaseListId,
                ingredient_id: body.ingredient_id,
                required_quantity: body.required_quantity,
                required_unit: body.required_unit,
                suggested_batch_size,
                suggested_total_batches,
                batch_unit: ingredientDetails.base_purchase_unit, // Use base unit as batch unit
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to add item to purchase list',
                message: error.message,
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