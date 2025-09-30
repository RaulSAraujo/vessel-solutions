// composables/api/useDrinksApi.ts
import { ref } from 'vue';
import type { Ref } from 'vue';
import type {
    Tables,
    TablesInsert,
    TablesUpdate,
} from '~/types/database';

export function useDrinksApi() {
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);

    // --- Drink CRUD ---

    const fetchDrinks = async (): Promise<Tables<'drinks'>[] | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'drinks'>[]>('/api/drinks');
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch drinks.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const getDrinkById = async (id: string): Promise<Tables<'drinks'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'drinks'>>(`/api/drinks/${id}`);
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to fetch drink with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createDrink = async (drinkData: TablesInsert<'drinks'>): Promise<Tables<'drinks'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'drinks'>>('/api/drinks', {
                method: 'POST',
                body: drinkData,
            });
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to create drink.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateDrink = async (id: string, drinkData: TablesUpdate<'drinks'>): Promise<Tables<'drinks'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'drinks'>>(`/api/drinks/${id}`, {
                method: 'PUT',
                body: drinkData,
            });
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to update drink with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteDrink = async (id: string): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        try {
            const { error: fetchError } = await useFetch(`/api/drinks/${id}`, {
                method: 'DELETE',
            });
            if (fetchError.value) throw fetchError.value;
            return true;
        } catch (e: any) {
            error.value = e.message || `Failed to delete drink with ID ${id}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    // --- Recipe Ingredients ---

    const addRecipeIngredient = async (
        drinkId: string,
        ingredientData: TablesInsert<'recipe_ingredients'>
    ): Promise<Tables<'drinks'> | null> => { // Retorna o drink atualizado com o novo custo
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'drinks'>>(
                `/api/drinks/${drinkId}/recipe`,
                {
                    method: 'POST',
                    body: ingredientData,
                }
            );
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to add ingredient to recipe.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateRecipeIngredient = async (
        drinkId: string,
        ingredientId: string,
        ingredientData: TablesUpdate<'recipe_ingredients'>
    ): Promise<Tables<'recipe_ingredients'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'recipe_ingredients'>>(
                `/api/drinks/${drinkId}/recipe/${ingredientId}`,
                {
                    method: 'PUT',
                    body: ingredientData,
                }
            );
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to update recipe ingredient with ID ${ingredientId}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteRecipeIngredient = async (drinkId: string, ingredientId: string): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        try {
            const { error: fetchError } = await useFetch(
                `/api/drinks/${drinkId}/recipe/${ingredientId}`,
                {
                    method: 'DELETE',
                }
            );
            if (fetchError.value) throw fetchError.value;
            return true;
        } catch (e: any) {
            error.value = e.message || `Failed to delete recipe ingredient with ID ${ingredientId}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        fetchDrinks,
        getDrinkById,
        createDrink,
        updateDrink,
        deleteDrink,
        addRecipeIngredient,
        updateRecipeIngredient,
        deleteRecipeIngredient,
    };
}