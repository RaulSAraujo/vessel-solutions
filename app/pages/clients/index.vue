<script setup lang="ts">
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { Datum } from "~/types/client";
import type { VDataTableServerOptions } from "~/types/data-table";

definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const api = useClientsApi();

const items = ref<Datum[]>([]);
const totalItems = ref(0);

const headers = [
  { title: "Nome", key: "name" },
  { title: "E-mail", key: "email" },
  { title: "Telefone", key: "phone" },
  { title: "Cidade", key: "city" },
  { title: "Ações", key: "actions", sortable: false },
];

async function fetchClients(props: VDataTableServerOptions) {
  const res = await api.getClients(props);

  if (res) {
    items.value = res.data;
    totalItems.value = res.page.totalRows;
  }
}
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 mb-4">Clientes</h1>

    <div class="d-flex align-center justify-end mb-4">
      <v-btn color="primary" prepend-icon="mdi-plus" text="Novo cliente" />

      <v-spacer />

      <v-btn
        class="mr-2"
        color="primary"
        variant="outlined"
        text="Limpar filtros"
      />

      <v-btn color="primary" text="Buscar" @click="fetchClients" />
    </div>

    <v-alert v-if="api.errorMessage.value" type="error" class="mb-4">
      {{ api.errorMessage.value }}
    </v-alert>

    <v-card>
      <UiTable
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        item-value="id"
        :loading="api.loading.value"
        @update:options="fetchClients"
      >
        <template #item.actions>
          <v-icon small class="mr-2"> mdi-pencil </v-icon>

          <v-icon small> mdi-delete </v-icon>
        </template>
      </UiTable>
    </v-card>
  </v-container>
</template>
