<script lang="ts" setup>
defineProps<{
  icon: string;
  title: string;
  description: string;
  color?: string;
}>();
</script>

<template>
  <v-card class="pa-6 text-center" elevation="2" rounded="lg" max-height="250">
    <v-icon size="64" :color="color || 'primary'" class="mb-4" :icon="icon" />

    <v-card-title class="text-h6 justify-center">
      {{ title }}
    </v-card-title>

    <v-card-text>
      {{ description }}
    </v-card-text>
  </v-card>
</template>
