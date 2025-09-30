import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { calculateIngredientCosts } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesInsert<'ingredients'>>(event);

        if (!body.name || !body.purchase_price || !body.base_purchase_quantity || !body.base_purchase_unit) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required ingredient fields.',
            });
        }

        // Default wastage_percentage if not provided
        const wastage_percentage = body.wastage_percentage ?? 0.05;

        // Calculate costs
        const { cost_per_base_unit, real_cost_per_base_unit } = calculateIngredientCosts({
            purchase_price: body.purchase_price,
            base_purchase_quantity: body.base_purchase_quantity,
            wastage_percentage: wastage_percentage,
        });

        const { data, error } = await client
            .from('ingredients')
            .insert({
                ...body,
                wastage_percentage,
                cost_per_base_unit,
                real_cost_per_base_unit,
                user_id: user.id,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create ingredient',
                message: error.message,
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