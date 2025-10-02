<script lang="ts" setup>
defineProps<{
  icon: string;
  title: number | string;
  color?: string;
  loading?: boolean;
  description: string;
}>();
</script>

<template>
  <v-card class="pa-4 text-center border-sm" elevation="2" rounded="xl">
    <v-icon size="48" :color="color || 'primary'">{{ icon }}</v-icon>

    <v-card-title v-if="!loading" class="text-h5">
      {{ title }}
    </v-card-title>

    <v-skeleton-loader v-else type="text" />

    <v-card-subtitle>{{ description }}</v-card-subtitle>
  </v-card>
</template>
