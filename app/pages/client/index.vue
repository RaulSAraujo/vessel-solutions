<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const drawer = ref(false);
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4">
      <v-icon size="24" class="mr-2" icon="mdi-account-group" />
      <h1 class="text-h5">Gerenciamento de Clientes</h1>
    </div>

    <ClientFilter v-model="drawer" />

    <ClientTable @open-filter="drawer = true" />
  </v-container>
</template>
