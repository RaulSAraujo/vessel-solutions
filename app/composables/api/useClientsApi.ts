import type { FetchError } from 'ofetch'
import type { Client } from '~/types/client';

export function useClientsApi() {
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);

    const fetchClients = async () => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const { data } = await useFetch<Client[]>('/api/clients');

            return data.value;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to fetch clients.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const getClientById = async (id: string) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const { data } = await useFetch<Client>(`/api/clients/${id}`);
            return data.value;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to fetch client with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createClient = async (clientData: Partial<Client>) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const { data } = await useFetch<Client>('/api/clients', {
                method: 'POST',
                body: clientData,
            });

            return data.value;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to create client.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateClient = async (id: string, clientData: Partial<Client>) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const { data } = await useFetch<Client>(`/api/clients/${id}`, {
                method: 'PUT',
                body: clientData,
            });

            return data.value;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to update client with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteClient = async (id: string) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            await useFetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to delete client with ID ${id}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        errorMessage,
        fetchClients,
        getClientById,
        createClient,
        updateClient,
        deleteClient,
    };
}