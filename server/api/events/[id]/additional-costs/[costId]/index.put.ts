import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;
        const costId = event.context.params?.costId;
        const body = await readBody<TablesUpdate<'event_additional_costs'>>(event);

        if (!eventId || !costId || (!body.quantity && !body.unit_cost)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing required fields for updating additional cost.',
            });
        }

        const updatedFields: TablesUpdate<'event_additional_costs'> = { ...body };

        // If quantity or unit_cost is updated, recalculate total_cost
        if (body.quantity !== undefined || body.unit_cost !== undefined) {
            const { data: currentCost, error: fetchError } = await client
                .from('event_additional_costs')
                .select('quantity, unit_cost')
                .eq('id', costId)
                .eq('event_id', eventId)
                .single();

            if (fetchError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to fetch current additional cost data for recalculation',
                    message: fetchError.message,
                });
            }

            const quantity = body.quantity ?? currentCost.quantity;
            const unit_cost = body.unit_cost ?? currentCost.unit_cost;

            updatedFields.total_cost = quantity * unit_cost;
        }

        const { data, error } = await client
            .from('event_additional_costs')
            .update(updatedFields)
            .eq('id', costId)
            .eq('event_id', eventId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update additional cost',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Additional cost with ID ${costId} for event ${eventId} not found or not accessible.`,
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