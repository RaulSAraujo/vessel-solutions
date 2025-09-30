// server/api/reports/monthly-events.get.ts
import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { Database } from '~/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // SQL para contar eventos por mês para o usuário logado
        // Nota: O Supabase (PostgREST) não suporta GROUP BY em funções de agregação complexas diretamente via API.
        // A abordagem mais robusta é usar uma View ou Function no PostgreSQL, ou fazer a agregação no Nitro.
        // Para simplificar, faremos a agregação no Nitro aqui.
        const { data: eventsData, error } = await client
            .from('events')
            .select('event_date')
            .eq('user_id', user.id) // RLS já filtra, mas bom explicitar
            .order('event_date', { ascending: true });

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch monthly events data',
                message: error.message,
            });
        }

        const monthlyEvents: { [key: string]: number } = {}; // { 'YYYY-MM': count }

        eventsData.forEach(e => {
            const date = new Date(e.event_date);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyEvents[yearMonth] = (monthlyEvents[yearMonth] || 0) + 1;
        });

        // Converter para formato de séries para o gráfico
        const categories = Object.keys(monthlyEvents).sort();
        const seriesData = categories.map(month => monthlyEvents[month]);

        return {
            categories,
            series: [{ name: 'Número de Eventos', data: seriesData }],
        };
    } catch (e: any) {
        throw createError({
            statusCode: e.statusCode || 500,
            statusMessage: e.statusMessage || 'Internal Server Error',
            message: e.message,
        });
    }
});