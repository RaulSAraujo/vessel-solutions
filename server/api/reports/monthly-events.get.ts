import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from 'ofetch'

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        const { data: eventsData, error } = await client
            .from('events')
            .select('event_date')
            .eq('user_id', user.id)
            .order('event_date', { ascending: true });

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch monthly events data',
                message: error.message,
            });
        }

        const monthlyEventsMap: { [key: string]: number } = {}; // { 'YYYY-MM': count }

        // Agrupa e conta os eventos por mês/ano
        eventsData.forEach(e => {
            const date = new Date(e.event_date);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyEventsMap[yearMonth] = (monthlyEventsMap[yearMonth] || 0) + 1;
        });

        // Garante a ordem cronológica dos meses
        const sortedYearMonths = Object.keys(monthlyEventsMap).sort();

        // Prepara o array de dados para o BarChart
        const chartData: { month: string; 'Número de Eventos': number }[] = [];

        sortedYearMonths.forEach(yearMonth => {
            const [year, month] = yearMonth.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1); // Mês é 0-indexado
            const formattedMonth = date.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });

            chartData.push({
                month: formattedMonth, // Mês já formatado
                'Número de Eventos': monthlyEventsMap[yearMonth], // Contagem de eventos
            });
        });

        // Define as categorias da série para a legenda do gráfico
        const chartSeriesCategories = {
            'Número de Eventos': {
                name: 'Número de Eventos',
                color: "#3b82f6", // Cor da barra
            },
        };

        return {
            data: chartData, // Array de objetos com mês formatado e contagem
            categories: chartSeriesCategories, // Objeto de configuração da série
        };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
            message: err.message,
        });
    }
});