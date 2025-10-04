<script lang="ts" setup>
defineEmits(["clear"]);
</script>

<template>
  <v-tooltip text="Limpar filtros" location="left">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="mr-2"
        rounded="xl"
        color="grey"
        variant="plain"
        density="comfortable"
        icon="mdi-backspace-reverse"
        @click="$emit('clear')"
      />
    </template>
  </v-tooltip>
</template>
