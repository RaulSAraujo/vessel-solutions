<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "default",
});
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 mb-4">Clientes</h1>

    <ClientFilter />

    <ClientTable />
  </v-container>
</template>
