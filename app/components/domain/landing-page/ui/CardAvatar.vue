<script lang="ts" setup>
defineProps<{
  image: string;
  imageAlt: string;
  description: string;
  subtitle: string;
}>();
</script>

<template>
  <v-card class="pa-6" elevation="2" rounded="lg" max-height="450">
    <v-avatar size="96" class="mb-4">
      <v-img :src="image" :alt="imageAlt" />
    </v-avatar>

    <v-card-text class="text-h6 font-italic">
      {{ description }}
    </v-card-text>

    <v-card-subtitle class="font-weight-bold">
      {{ subtitle }}
    </v-card-subtitle>
  </v-card>
</template>
