import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { Clients, Datum } from '~/types/client';
import type { VDataTableServerOptions } from '~/types/data-table';

export function useClientsApi() {
    const getClients = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Clients>('/api/clients', {
                query: {
                    ...props,
                    filters
                }
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch clients.');
        }
    };

    const getClientById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/clients/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch client with ID ${id}.`);
        }
    };

    const createClient = async (clientData: Partial<Datum>) => {
        try {
            const res = await $fetch<Datum>('/api/clients', {
                method: 'POST',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create client.');
        }
    };

    const updateClient = async (id: string, clientData: Partial<Datum>) => {
        try {

            const res = await $fetch<Client>(`/api/clients/${id}`, {
                method: 'PUT',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update client with ID ${id}.`);
        }
    };

    const deleteClient = async (id: string) => {
        try {

            await $fetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete client with ID ${id}.`);
        }
    };

    return {
        getClients,
        getClientById,
        createClient,
        updateClient,
        deleteClient,
    };
}