<script lang="ts" setup>
import type { FilterDefinition, EmittedFilters } from "~/types/filter";

const store = useClientTableStore();

const eventFilters = ref<FilterDefinition[]>([
  {
    key: "name",
    label: "Nome do Cliente",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
]);

const activeFilters = ref<EmittedFilters>({});
</script>

<template>
  <UiFilter
    v-model="activeFilters"
    :event-filters="eventFilters"
    @clear="store.fetchClients"
    @search="store.fetchClients(undefined, activeFilters)"
  />
</template>
