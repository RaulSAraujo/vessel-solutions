<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const store = useClientStore();
const { activeFilters } = storeToRefs(store);

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
</script>

<template>
  <v-navigation-drawer temporary location="right" width="300" class="pa-2">
    <UiFilter
      v-model="activeFilters"
      :event-filters="eventFilters"
      @clear="store.fetchClients"
      @search="store.fetchClients"
    />
  </v-navigation-drawer>
</template>
