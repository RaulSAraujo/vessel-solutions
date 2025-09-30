// composables/api/useEventsApi.ts
import { ref } from 'vue';
import type { Ref } from 'vue';
import type {
    Tables,
    TablesInsert,
    TablesUpdate,
} from '~/types/database';

export function useEventsApi() {
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);

    // --- Event CRUD ---

    const fetchEvents = async (): Promise<Tables<'events'>[] | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'events'>[]>('/api/events');
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch events.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const getEventById = async (id: string): Promise<Tables<'events'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'events'>>(`/api/events/${id}`);
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to fetch event with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createEvent = async (eventData: TablesInsert<'events'>): Promise<Tables<'events'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'events'>>('/api/events', {
                method: 'POST',
                body: eventData,
            });
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to create event.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateEvent = async (id: string, eventData: TablesUpdate<'events'>): Promise<Tables<'events'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'events'>>(`/api/events/${id}`, {
                method: 'PUT',
                body: eventData,
            });
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to update event with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteEvent = async (id: string): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        try {
            const { error: fetchError } = await useFetch(`/api/events/${id}`, {
                method: 'DELETE',
            });
            if (fetchError.value) throw fetchError.value;
            return true;
        } catch (e: any) {
            error.value = e.message || `Failed to delete event with ID ${id}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    // --- Event Served Drinks ---

    const addServedDrink = async (
        eventId: string,
        servedDrinkData: TablesInsert<'event_served_drinks'>
    ): Promise<Tables<'event_served_drinks'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'event_served_drinks'>>(
                `/api/events/${eventId}/served-drinks`,
                {
                    method: 'POST',
                    body: servedDrinkData,
                }
            );
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to add served drink.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateServedDrink = async (
        eventId: string,
        servedDrinkId: string,
        servedDrinkData: TablesUpdate<'event_served_drinks'>
    ): Promise<Tables<'event_served_drinks'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'event_served_drinks'>>(
                `/api/events/${eventId}/served-drinks/${servedDrinkId}`,
                {
                    method: 'PUT',
                    body: servedDrinkData,
                }
            );
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to update served drink with ID ${servedDrinkId}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteServedDrink = async (eventId: string, servedDrinkId: string): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        try {
            const { error: fetchError } = await useFetch(
                `/api/events/${eventId}/served-drinks/${servedDrinkId}`,
                {
                    method: 'DELETE',
                }
            );
            if (fetchError.value) throw fetchError.value;
            return true;
        } catch (e: any) {
            error.value = e.message || `Failed to delete served drink with ID ${servedDrinkId}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    // --- Event Additional Costs ---

    const addAdditionalCost = async (
        eventId: string,
        costData: TablesInsert<'event_additional_costs'>
    ): Promise<Tables<'event_additional_costs'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'event_additional_costs'>>(
                `/api/events/${eventId}/additional-costs`,
                {
                    method: 'POST',
                    body: costData,
                }
            );
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to add additional cost.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateAdditionalCost = async (
        eventId: string,
        costId: string,
        costData: TablesUpdate<'event_additional_costs'>
    ): Promise<Tables<'event_additional_costs'> | null> => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useFetch<Tables<'event_additional_costs'>>(
                `/api/events/${eventId}/additional-costs/${costId}`,
                {
                    method: 'PUT',
                    body: costData,
                }
            );
            if (fetchError.value) throw fetchError.value;
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to update additional cost with ID ${costId}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteAdditionalCost = async (eventId: string, costId: string): Promise<boolean> => {
        loading.value = true;
        error.value = null;
        try {
            const { error: fetchError } = await useFetch(
                `/api/events/${eventId}/additional-costs/${costId}`,
                {
                    method: 'DELETE',
                }
            );
            if (fetchError.value) throw fetchError.value;
            return true;
        } catch (e: any) {
            error.value = e.message || `Failed to delete additional cost with ID ${costId}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        fetchEvents,
        getEventById,
        createEvent,
        updateEvent,
        deleteEvent,
        addServedDrink,
        updateServedDrink,
        deleteServedDrink,
        addAdditionalCost,
        updateAdditionalCost,
        deleteAdditionalCost,
    };
}