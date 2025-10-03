import type { FetchError } from 'ofetch'
import type { Clients, Datum } from '~/types/client';
import type { VDataTableServerOptions } from '~/types/data-table';

export function useClientsApi() {
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);

    const getClients = async (props?: VDataTableServerOptions) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const res = await $fetch<Clients>('/api/clients', {
                query: props
            });

            return res;
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

            const res = await $fetch<Datum>(`/api/clients/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || `Failed to fetch client with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createClient = async (clientData: Partial<Datum>) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const res = await $fetch<Datum>('/api/clients', {
                method: 'POST',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            errorMessage.value = err.message || 'Failed to create client.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateClient = async (id: string, clientData: Partial<Datum>) => {
        try {
            loading.value = true;
            errorMessage.value = null;

            const res = await $fetch<Client>(`/api/clients/${id}`, {
                method: 'PUT',
                body: clientData,
            });

            return res;
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

            await $fetch(`/api/clients/${id}`, {
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
        getClients,
        getClientById,
        createClient,
        updateClient,
        deleteClient,
    };
}