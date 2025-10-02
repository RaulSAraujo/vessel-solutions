import type { FetchError } from 'ofetch'
import type { Event, EventServedDrinks, EventAdditionalCost } from '~/types/event'

export function useEventsApi() {
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);

    const fetchEvents = async () => {
        try {
            loading.value = true;
            errorMessage.value = null;
            return await $fetch<Event[]>('/api/events');
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to fetch events.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const getEventById = async (id: string) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            return await $fetch<Event>(`/api/events/${id}`);
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to fetch event with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createEvent = async (eventData: Partial<Event>) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            return await $fetch<Event>('/api/events', {
                method: 'POST',
                body: eventData,
            })
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to create event.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateEvent = async (id: string, eventData: Partial<Event>) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            return await $fetch<Event>(`/api/events/${id}`, {
                method: 'PUT',
                body: eventData,
            });
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to update event with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            await $fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to delete event with ID ${id}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    // --- Event Served Drinks ---
    const addServedDrink = async (eventId: string, servedDrinkData: EventServedDrinks) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            return await $fetch<EventServedDrinks>(
                `/api/events/${eventId}/served-drinks`,
                {
                    method: 'POST',
                    body: servedDrinkData,
                }
            )
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to add served drink.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateServedDrink = async (eventId: string, servedDrinkId: string, servedDrinkData: Partial<EventServedDrinks>) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            const res = await $fetch<EventServedDrinks>(
                `/api/events/${eventId}/served-drinks/${servedDrinkId}`,
                {
                    method: 'PUT',
                    body: servedDrinkData,
                }
            );

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to update served drink with ID ${servedDrinkId}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteServedDrink = async (eventId: string, servedDrinkId: string): Promise<boolean> => {
        try {
            loading.value = true;
            errorMessage.value = null;
            await $fetch(
                `/api/events/${eventId}/served-drinks/${servedDrinkId}`,
                {
                    method: 'DELETE',
                }
            );

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to delete served drink with ID ${servedDrinkId}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    // --- Event Additional Costs ---

    const addAdditionalCost = async (eventId: string, costData: EventAdditionalCost) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            const res = await $fetch<EventAdditionalCost>(`/api/events/${eventId}/additional-costs`, {
                method: 'POST',
                body: costData,
            });
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to add additional cost.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateAdditionalCost = async (eventId: string, costId: string, costData: Partial<EventAdditionalCost>) => {
        try {
            loading.value = true;
            errorMessage.value = null;
            const res = await $fetch<EventAdditionalCost>(`/api/events/${eventId}/additional-costs/${costId}`, {
                method: 'PUT',
                body: costData,
            });
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to update additional cost with ID ${costId}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteAdditionalCost = async (eventId: string, costId: string): Promise<boolean> => {
        try {
            loading.value = true;
            errorMessage.value = null;
            await $fetch(`/api/events/${eventId}/additional-costs/${costId}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to delete additional cost with ID ${costId}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        errorMessage,
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