import { getSupabaseClientAndUser } from '../../utils/supabase';

import type { FetchError } from "ofetch";

// Helper para converter unidades (simplificado, você precisaria de uma tabela de conversão real)
function convertUnits(quantity: number, fromUnit: string, toUnit: string): number {
    // Exemplo simplificado: 1ml = 1g para líquidos, 1g = 1g para sólidos
    // Em um sistema real, você teria uma tabela de conversão ou um serviço mais robusto.
    if (fromUnit === toUnit) return quantity;
    if ((fromUnit === 'ml' && toUnit === 'g') || (fromUnit === 'g' && toUnit === 'ml')) return quantity; // Assumindo densidade ~1
    // Adicione mais regras de conversão conforme necessário
    return quantity; // Fallback, pode ser melhor lançar um erro
}

async function recalculateDrinkCost(client: any, drinkId: string): Promise<number> {
    // 1. Obter todos os ingredientes da receita para este drink
    const { data: recipeIngredients, error: recipeError } = await client
        .from('recipe_ingredients')
        .select('required_quantity, recipe_unit, ingredient_id')
        .eq('drink_id', drinkId);

    if (recipeError) throw recipeError;

    let totalCost = 0;

    for (const recipeItem of recipeIngredients) {
        // 2. Para cada ingrediente, obter seu custo real por unidade base
        const { data: ingredient, error: ingredientError } = await client
            .from('ingredients')
            .select('real_cost_per_base_unit, base_purchase_unit')
            .eq('id', recipeItem.ingredient_id)
            .single();

        if (ingredientError) throw ingredientError;

        // 3. Converter a quantidade necessária da receita para a unidade base do ingrediente
        const convertedQuantity = convertUnits(
            recipeItem.required_quantity,
            recipeItem.recipe_unit,
            ingredient.base_purchase_unit
        );

        // 4. Calcular o custo do ingrediente na receita
        totalCost += convertedQuantity * ingredient.real_cost_per_base_unit;
    }

    return totalCost;
}


export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const drinkId = event.context.params?.id;
        const body = await readBody(event);

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

        return updatedDrink[0];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});