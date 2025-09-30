import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const servedDrinkId = event.context.params?.servedDrinkId;
        const body = await readBody<TablesUpdate<'event_served_drinks'>>(event);

        if (!eventId || !servedDrinkId || (!body.served_quantity && !body.unit_cost_at_event)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for updating served drink.',
            });
        }

        const updatedFields: TablesUpdate<'event_served_drinks'> = { ...body };

        // If served_quantity or unit_cost_at_event is updated, recalculate total_cost_at_event
        if (body.served_quantity !== undefined || body.unit_cost_at_event !== undefined) {
            const { data: currentServedDrink, error: fetchError } = await client
                .from('event_served_drinks')
                .select('served_quantity, unit_cost_at_event')
                .eq('id', servedDrinkId)
                .eq('event_id', eventId)
                .single();

            if (fetchError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to fetch current served drink data for recalculation',
                    message: fetchError.message,
                });
            }

            const served_quantity = body.served_quantity ?? currentServedDrink.served_quantity;
            const unit_cost_at_event = body.unit_cost_at_event ?? currentServedDrink.unit_cost_at_event;

            if (unit_cost_at_event !== null) {
                updatedFields.total_cost_at_event = served_quantity * unit_cost_at_event;
            }
        }

        const { data, error } = await client
            .from('event_served_drinks')
            .update(updatedFields)
            .eq('id', servedDrinkId)
            .eq('event_id', eventId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update served drink',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Served drink with ID ${servedDrinkId} for event ${eventId} not found or not accessible.`,
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