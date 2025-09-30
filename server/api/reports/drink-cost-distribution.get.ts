// server/api/reports/drink-cost-distribution.get.ts
import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { Database } from '~/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const { data: drinksData, error } = await client
            .from('drinks')
            .select('name, calculated_unit_cost')
            .eq('user_id', user.id)
            .not('calculated_unit_cost', 'is', null) // Apenas drinks com custo calculado
            .order('calculated_unit_cost', { ascending: false })
            .limit(10); // Top 10 drinks por custo

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch drink cost distribution',
                message: error.message,
            });
        }

        const series = drinksData.map(d => ({
            name: d.name,
            data: d.calculated_unit_cost || 0, // Fallback para 0 se null
        }));

        return {
            series,
        };
    } catch (e: any) {
        throw createError({
            statusCode: e.statusCode || 500,
            statusMessage: e.statusMessage || 'Internal Server Error',
            message: e.message,
        });
    }
});