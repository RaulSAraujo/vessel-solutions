import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch';

const colorPalette = [
    "#3b82f6",
    "#a855f7",
    "#22c55e",
    "#ef4444",
    "#f59e0b",
    "#6366f1",
    "#ec4899",
    "#14b8a6",
    "#84cc16",
    "#eab308",
];

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // 1. Validação de autenticação
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
                message: 'User not authenticated.',
            });
        }

        // 2. Busca dos top 10 drinks por custo unitário
        const { data: drinksData, error } = await client
            .from('drinks')
            .select('name, calculated_unit_cost')
            .eq('user_id', user.id)
            .not('calculated_unit_cost', 'is', null) // Apenas drinks com custo calculado
            .order('calculated_unit_cost', { ascending: false }) // Do mais caro para o mais barato
            .limit(10); // Top 10 drinks

        if (error) {
            console.error('Supabase fetch error:', error); // Log do erro para depuração
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch drink cost distribution',
                message: error.message,
            });
        }

        // 3. Transformação dos dados para o formato esperado pelo frontend
        // O frontend espera um array de objetos com { color, name, value }
        const transformedData = drinksData.map((d, index) => ({
            color: colorPalette[index % colorPalette.length], // Atribui uma cor da paleta (cicla se houver mais de 10)
            name: d.name || `Drink ${index + 1}`, // Fallback para nome se for nulo
            value: d.calculated_unit_cost || 0, // Fallback para 0 se o custo for nulo
        }));

        return transformedData; // Retorna o array de dados já formatado

    } catch (error: unknown) {
        const err = error as FetchError;
        console.error('API handler error:', err); // Log do erro para depuração

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        });
    }
});