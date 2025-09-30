import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import { recalculateDrinkCost } from '~~/server/utils/calculations';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const body = await readBody<TablesInsert<'recipe_ingredients'>>(event);

        if (!drinkId || !body.ingredient_id || !body.required_quantity || !body.recipe_unit) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for recipe ingredient.',
            });
        }

        // 1. Adicionar ingrediente à receita
        const { error: insertError } = await client
            .from('recipe_ingredients')
            .insert({
                drink_id: drinkId,
                ingredient_id: body.ingredient_id,
                required_quantity: body.required_quantity,
                recipe_unit: body.recipe_unit,
            });

        if (insertError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to add ingredient to recipe',
                message: insertError.message,
            });
        }

        // 2. Recalcular o custo total do drink
        const newCalculatedCost = await recalculateDrinkCost(client, drinkId);

        // 3. Atualizar o drink com o novo custo
        const { data: updatedDrink, error: updateError } = await client
            .from('drinks')
            .update({ calculated_unit_cost: newCalculatedCost })
            .eq('id', drinkId)
            .select();

        if (updateError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update drink cost after recipe change',
                message: updateError.message,
            });
        }

        return updatedDrink[0] as Tables<'drinks'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});