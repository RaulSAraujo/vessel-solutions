<script lang="ts" setup>
defineEmits(["openFilter"]);

const store = useClientStore();
const { page, itemsPerPage, items, totalItems, loading } = storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Nome", key: "name" },
  { title: "E-mail", key: "email" },
  { title: "Documento", key: "tax_id" },
  { title: "Telefone", key: "phone" },
  { title: "Cidade", key: "city" },
  { title: "Endereço", key: "address" },
  { title: "Criado em", key: "created_at" },
  { title: "Atualizado em", key: "updated_at" },
];
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de clientes"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchClients"
  >
    <template #buttons>
      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        icon="mdi-refresh"
        density="comfortable"
        @click="store.fetchClients"
      />

      <v-btn
        rounded="xl"
        color="grey"
        icon="mdi-plus"
        variant="text"
        density="comfortable"
      />
    </template>

    <template #item.actions>
      <v-icon icon="mdi-dots-vertical" small class="mr-2" />
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
