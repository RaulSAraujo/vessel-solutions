<script lang="ts" setup>
const store = useClientTableStore();
const { items, totalItems, loading } = storeToRefs(store);

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
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :items-length="totalItems"
    @update:options="store.fetchClients"
  >
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
