import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { recalculateDrinkCost } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const ingredientId = event.context.params?.ingredientId;

        if (!drinkId || !ingredientId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Drink ID and Ingredient ID are required.',
            });
        }

        // 1. Excluir ingrediente da receita
        const { error } = await client
            .from('recipe_ingredients')
            .delete()
            .eq('drink_id', drinkId)
            .eq('ingredient_id', ingredientId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete ingredient from recipe',
                message: error.message,
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
                statusMessage: 'Failed to update drink cost after recipe ingredient deletion',
                message: updateDrinkError.message,
            });
        }

        return { message: `Ingredient ${ingredientId} removed from drink ${drinkId} recipe successfully.` };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});