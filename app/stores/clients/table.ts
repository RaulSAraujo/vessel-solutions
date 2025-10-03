import { defineStore } from 'pinia';
import { useClientsApi } from '~/composables/api/useClientsApi';

import type { Datum } from "~/types/client";
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from "~/types/data-table";

export const useClientTableStore = defineStore('clientTable', () => {
    const totalItems = ref(0)
    const loading = ref(false)
    const items = ref<Datum[]>([])

    async function fetchClients(props?: VDataTableServerOptions, filters?: EmittedFilters) {
        loading.value = true;

        const res = await useClientsApi().getClients(props, filters);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;
    }

    return {
        items,
        loading,
        totalItems,
        fetchClients
    }
})