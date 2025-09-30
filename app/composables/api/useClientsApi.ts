import type { Tables, TablesInsert, TablesUpdate } from '~/types/database';

export function useClientsApi() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchClients = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await useFetch<Tables<'clients'>[]>('/api/clients');
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch clients.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const getClientById = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await useFetch<Tables<'clients'>>(`/api/clients/${id}`);
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to fetch client with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createClient = async (clientData: TablesInsert<'clients'>) => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await useFetch<Tables<'clients'>>('/api/clients', {
                method: 'POST',
                body: clientData,
            });
            return data.value;
        } catch (e: any) {
            error.value = e.message || 'Failed to create client.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateClient = async (id: string, clientData: TablesUpdate<'clients'>) => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await useFetch<Tables<'clients'>>(`/api/clients/${id}`, {
                method: 'PUT',
                body: clientData,
            });
            return data.value;
        } catch (e: any) {
            error.value = e.message || `Failed to update client with ID ${id}.`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteClient = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            await useFetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });
            return true;
        } catch (e: any) {
            error.value = e.message || `Failed to delete client with ID ${id}.`;
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        fetchClients,
        getClientById,
        createClient,
        updateClient,
        deleteClient,
    };
}