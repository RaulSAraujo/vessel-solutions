import { getSupabaseClientAndUser } from '../../utils/supabase';
import type { FetchError } from "ofetch";
import type { Tables, TablesInsert } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesInsert<'purchase_lists'>>(event);

        // Default status and generation_date if not provided
        const status = body.status ?? 'Generated';
        const generation_date = body.generation_date ?? new Date().toISOString();

        const { data, error } = await client
            .from('purchase_lists')
            .insert({
                ...body,
                status,
                generation_date,
                user_id: user.id,
            })
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create purchase list',
                message: error.message,
            });
        }

        return data[0] as Tables<'purchase_lists'>;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});