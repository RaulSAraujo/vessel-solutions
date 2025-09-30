import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { calculateIngredientCosts } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const ingredientId = event.context.params?.id;
        const body = await readBody<TablesUpdate<'ingredients'>>(event);

        if (!ingredientId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Ingredient ID is required.',
            });
        }

        const updatedFields: TablesUpdate<'ingredients'> = { ...body };

        // Check if fields relevant to cost calculation are being updated
        if (
            body.purchase_price !== undefined ||
            body.base_purchase_quantity !== undefined ||
            body.wastage_percentage !== undefined
        ) {
            // Fetch current ingredient data to get missing values for calculation
            const { data: currentIngredient, error: fetchError } = await client
                .from('ingredients')
                .select('purchase_price, base_purchase_quantity, wastage_percentage')
                .eq('id', ingredientId)
                .single();

            if (fetchError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to fetch current ingredient data for recalculation',
                    message: fetchError.message,
                });
            }

            const purchase_price = body.purchase_price ?? currentIngredient.purchase_price;
            const base_purchase_quantity = body.base_purchase_quantity ?? currentIngredient.base_purchase_quantity;
            const wastage_percentage = body.wastage_percentage ?? currentIngredient.wastage_percentage;

            const { cost_per_base_unit, real_cost_per_base_unit } = calculateIngredientCosts({
                purchase_price,
                base_purchase_quantity,
                wastage_percentage,
            });

            updatedFields.cost_per_base_unit = cost_per_base_unit;
            updatedFields.real_cost_per_base_unit = real_cost_per_base_unit;
        }

        const { data, error } = await client
            .from('ingredients')
            .update(updatedFields)
            .eq('id', ingredientId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update ingredient',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Ingredient with ID ${ingredientId} not found or not accessible for update.`,
            });
        }

        return data[0] as Tables<'ingredients'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});