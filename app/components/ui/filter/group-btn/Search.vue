<script lang="ts" setup>
defineEmits(["search"]);
</script>

<template>
  <v-btn rounded="lg" color="primary" text="Buscar" @click="$emit('search')" />
</template>
