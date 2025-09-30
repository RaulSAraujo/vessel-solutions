import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const body = await readBody<TablesInsert<'event_served_drinks'>>(event);

        if (!eventId || !body.drink_id || !body.served_quantity) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for served drink.',
            });
        }

        // Fetch drink's calculated_unit_cost at the time of adding
        const { data: drinkData, error: drinkError } = await client
            .from('drinks')
            .select('calculated_unit_cost')
            .eq('id', body.drink_id)
            .single();

        if (drinkError || !drinkData?.calculated_unit_cost) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Drink with ID ${body.drink_id} not found or has no calculated cost.`,
            });
        }

        const unit_cost_at_event = drinkData.calculated_unit_cost;
        const total_cost_at_event = unit_cost_at_event * body.served_quantity;

        const { data, error } = await client
            .from('event_served_drinks')
            .insert({
                event_id: eventId,
                drink_id: body.drink_id,
                served_quantity: body.served_quantity,
                unit_cost_at_event,
                total_cost_at_event,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to add served drink to event',
                message: error.message,
            });
        }

        return data[0] as Tables<'event_served_drinks'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});