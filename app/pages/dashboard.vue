<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Dashboard</h1>

    <p class="mb-6">
      Visão geral e métricas importantes do seu negócio de coquetelaria.
    </p>

    <DashboardKpiSection />

    <DashboardChartSection />
  </v-container>
</template>

<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
}
</style>
