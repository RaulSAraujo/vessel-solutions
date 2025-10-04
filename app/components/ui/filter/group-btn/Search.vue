<script lang="ts" setup>
defineEmits(["search"]);
</script>

<template>
  <v-btn
    rounded="lg"
    color="primary"
    text="Buscar"
    width="200"
    prepend-icon="mdi-magnify"
    @click="$emit('search')"
  />
</template>
