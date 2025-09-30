// server/api/reports/profit-summary.get.ts
import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { Database } from '~/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);

        // Fetch all events for the user
        const { data: eventsData, error } = await client
            .from('events')
            .select('event_date, total_investment, gross_profit')
            .eq('user_id', user.id)
            .order('event_date', { ascending: true });

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch profit summary data',
                message: error.message,
            });
        }

        const monthlySummary: { [key: string]: { investment: number, profit: number } } = {};

        eventsData.forEach(e => {
            if (e.total_investment === null || e.gross_profit === null) return; // Skip if data is missing

            const date = new Date(e.event_date);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!monthlySummary[yearMonth]) {
                monthlySummary[yearMonth] = { investment: 0, profit: 0 };
            }
            monthlySummary[yearMonth].investment += e.total_investment;
            monthlySummary[yearMonth].profit += e.gross_profit;
        });

        const categories = Object.keys(monthlySummary).sort();
        const investmentSeries = categories.map(month => monthlySummary[month].investment);
        const profitSeries = categories.map(month => monthlySummary[month].profit);

        return {
            categories,
            series: [
                { name: 'Investimento Total', data: investmentSeries },
                { name: 'Lucro Bruto', data: profitSeries },
            ],
        };
    } catch (e: any) {
        throw createError({
            statusCode: e.statusCode || 500,
            statusMessage: e.statusMessage || 'Internal Server Error',
            message: e.message,
        });
    }
});