import { defineStore } from 'pinia';
import { useClientsApi } from '~/composables/api/useClientsApi';

import type { Datum } from "~/types/client";
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from "~/types/data-table";

export const useClientStore = defineStore('client', () => {
    // Tabela
    const page = ref(1);
    const totalItems = ref(0)
    const loading = ref(false)
    const items = ref<Datum[]>([])
    const itemsPerPage = ref<10 | 25 | 50>(10)

    // Filtros
    const activeFilters = ref<EmittedFilters>({});

    async function fetchClients(props?: VDataTableServerOptions) {
        loading.value = true;

        // Se props nao for passado, cria um objeto com as propriedades padrão
        if (!props || typeof props !== 'object' || !('page' in props)) {
            props = {
                page: page.value,
                itemsPerPage: itemsPerPage.value,
                groupBy: [],
                sortBy: [],
                search: '',
            };
        }

        const res = await useClientsApi().getClients(props, activeFilters.value);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;
    }

    return {
        page,
        items,
        loading,
        totalItems,
        fetchClients,
        itemsPerPage,
        activeFilters
    }
})