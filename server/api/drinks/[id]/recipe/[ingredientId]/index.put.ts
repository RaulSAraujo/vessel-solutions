import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { recalculateDrinkCost } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const ingredientId = event.context.params?.ingredientId;
        const body = await readBody<TablesUpdate<'recipe_ingredients'>>(event);

        if (!drinkId || !ingredientId || (!body.required_quantity && !body.recipe_unit)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for updating recipe ingredient.',
            });
        }

        // 1. Atualizar ingrediente na receita
        const { data, error: updateError } = await client
            .from('recipe_ingredients')
            .update(body)
            .eq('drink_id', drinkId)
            .eq('ingredient_id', ingredientId)
            .select();

        if (updateError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update ingredient in recipe',
                message: updateError.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Recipe ingredient for drink ${drinkId} and ingredient ${ingredientId} not found or not accessible.`,
            });
        }

        // 2. Recalcular o custo total do drink
        const newCalculatedCost = await recalculateDrinkCost(client, drinkId);

        // 3. Atualizar o drink com o novo custo
        const { error: updateDrinkError } = await client
            .from('drinks')
            .update({ calculated_unit_cost: newCalculatedCost })
            .eq('id', drinkId);

        if (updateDrinkError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update drink cost after recipe ingredient update',
                message: updateDrinkError.message,
            });
        }

        return data[0] as Tables<'recipe_ingredients'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});