import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const body = await readBody<TablesInsert<'event_additional_costs'>>(event);

        if (!eventId || !body.description || !body.quantity || !body.unit_cost) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for additional cost.',
            });
        }

        const total_cost = body.quantity * body.unit_cost;

        const { data, error } = await client
            .from('event_additional_costs')
            .insert({
                event_id: eventId,
                description: body.description,
                quantity: body.quantity,
                unit: body.unit,
                unit_cost: body.unit_cost,
                total_cost,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to add additional cost to event',
                message: error.message,
            });
        }

        return data[0] as Tables<'event_additional_costs'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});