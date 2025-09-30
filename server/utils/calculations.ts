import type { Database } from '../types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

// Helper para converter unidades (simplificado, você precisaria de uma tabela de conversão real)
export function convertUnits(quantity: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return quantity;
    // Exemplo simplificado: 1ml = 1g para líquidos, 1g = 1g para sólidos
    // Em um sistema real, você teria uma tabela de conversão ou um serviço mais robusto.
    if ((fromUnit === 'ml' && toUnit === 'g') || (fromUnit === 'g' && toUnit === 'ml')) return quantity;
    // Adicione mais regras de conversão conforme necessário
    return quantity; // Fallback, pode ser melhor lançar um erro
}

/**
 * Recalcula o custo unitário de um drink com base em seus ingredientes de receita.
 * @param client O cliente Supabase.
 * @param drinkId O ID do drink a ser recalculado.
 * @returns O novo custo unitário calculado.
 */
export async function recalculateDrinkCost(client: SupabaseClient<Database>, drinkId: string): Promise<number> {
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
        totalCost += convertedQuantity * (ingredient?.real_cost_per_base_unit || 0);
    }

    return totalCost;
}

/**
 * Calcula o custo por unidade base e o custo real por unidade base de um ingrediente.
 * @param ingredient O objeto ingrediente com purchase_price, base_purchase_quantity e wastage_percentage.
 * @returns Um objeto com cost_per_base_unit e real_cost_per_base_unit.
 */
export function calculateIngredientCosts(ingredient: {
    purchase_price: number;
    base_purchase_quantity: number;
    wastage_percentage: number;
}) {
    const cost_per_base_unit = ingredient.purchase_price / ingredient.base_purchase_quantity;
    const real_cost_per_base_unit = cost_per_base_unit * (1 + ingredient.wastage_percentage);
    return { cost_per_base_unit, real_cost_per_base_unit };
}