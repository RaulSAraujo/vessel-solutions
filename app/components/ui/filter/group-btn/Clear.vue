<script lang="ts" setup>
defineEmits(["clear"]);
</script>

<template>
  <v-btn
    class="mr-2"
    rounded="lg"
    color="primary"
    variant="outlined"
    text="Limpar filtros"
    @click="$emit('clear')"
  />
</template>
