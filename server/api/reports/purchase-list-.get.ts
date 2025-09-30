// server/api/reports/purchase-list.get.ts
import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from "~~/server/types/database";

// Helper para converter unidades (mesmo do exemplo anterior)
function convertUnits(quantity: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return quantity;
    if ((fromUnit === 'ml' && toUnit === 'g') || (fromUnit === 'g' && toUnit === 'ml')) return quantity;
    // Adicione mais regras de conversão conforme necessário
    return quantity;
}

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        // Parâmetros de query para filtrar eventos (opcional)
        const query = getQuery(event);
        const eventIds = query.eventIds ? (query.eventIds as string).split(',') : [];

        let eventsQuery = client
            .from('events')
            .select('id, estimated_total_drinks');

        if (eventIds.length > 0) {
            eventsQuery = eventsQuery.in('id', eventIds);
        }

        const { data: eventsData, error: eventsError } = await eventsQuery;

        if (eventsError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch events for purchase list',
                message: eventsError.message,
            });
        }

        if (!eventsData || eventsData.length === 0) {
            return { message: 'No events found for purchase list generation.', purchaseList: [] };
        }

        const requiredIngredients: {
            [ingredientId: string]: {
                name: string;
                totalRequiredQuantity: number;
                basePurchaseUnit: string;
                suggestedBatchSize?: number; // Adicionar se tivermos essa info no ingrediente
                suggestedTotalBatches?: number;
            }
        } = {};

        for (const eventItem of eventsData) {
            // Para cada evento, obter os drinks que serão servidos (assumindo que já temos uma estimativa)
            // Para uma lista de compras mais precisa, você precisaria de uma tabela `event_planned_drinks`
            // Por simplicidade, vamos assumir que `estimated_total_drinks` é distribuído igualmente pelos drinks mais populares ou algo assim.
            // Ou, melhor, vamos buscar os drinks que o usuário planejou para o evento.
            // Para este exemplo, vamos simplificar e assumir que o usuário vai informar quais drinks e quantidades.
            // Uma implementação real precisaria de uma tabela `event_planned_drinks` ou similar.

            // Para este exemplo, vamos buscar TODOS os drinks do usuário e assumir uma quantidade base para cada um
            // Isso é uma simplificação. O ideal seria ter os drinks específicos e quantidades para cada evento.
            const { data: userDrinks, error: drinksError } = await client
                .from('drinks')
                .select('id, name');

            if (drinksError) throw drinksError;

            for (const drink of userDrinks) {
                // Obter ingredientes da receita para cada drink
                const { data: recipeIngredients, error: recipeError } = await client
                    .from('recipe_ingredients')
                    .select('required_quantity, recipe_unit, ingredient_id')
                    .eq('drink_id', drink.id);

                if (recipeError) throw recipeError;

                for (const recipeItem of recipeIngredients) {
                    const { data: ingredientDetails, error: ingredientError } = await client
                        .from('ingredients')
                        .select('name, base_purchase_unit, suggested_batch_size') // Adicione suggested_batch_size se existir
                        .eq('id', recipeItem.ingredient_id)
                        .single();

                    if (ingredientError) throw ingredientError;

                    // Quantidade total necessária para o evento (simplificado: 1 drink por estimated_total_drinks)
                    // Em um cenário real, você teria a distribuição de drinks por evento
                    const totalDrinkQuantityForEvent = eventItem.estimated_total_drinks / userDrinks.length; // Exemplo simplificado
                    const requiredForThisDrink = recipeItem.required_quantity * totalDrinkQuantityForEvent;

                    const convertedQuantity = convertUnits(
                        requiredForThisDrink,
                        recipeItem.recipe_unit,
                        ingredientDetails.base_purchase_unit
                    );

                    if (!requiredIngredients[recipeItem.ingredient_id]) {
                        requiredIngredients[recipeItem.ingredient_id] = {
                            name: ingredientDetails.name,
                            totalRequiredQuantity: 0,
                            basePurchaseUnit: ingredientDetails.base_purchase_unit,
                            suggestedBatchSize: ingredientDetails.suggested_batch_size,
                        };
                    }
                    requiredIngredients[recipeItem.ingredient_id].totalRequiredQuantity += convertedQuantity;
                }
            }
        }

        // Calcular lotes sugeridos
        const finalPurchaseList = Object.values(requiredIngredients).map(item => {
            let suggestedTotalBatches = 0;
            if (item.suggestedBatchSize && item.suggestedBatchSize > 0) {
                suggestedTotalBatches = Math.ceil(item.totalRequiredQuantity / item.suggestedBatchSize);
            }
            return {
                ...item,
                suggestedTotalBatches,
            };
        });

        return { purchaseList: finalPurchaseList };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});