<script lang="ts" setup>
interface DonutDataItem {
  color: string;
  name: string;
  value: number;
}

const isLoading = ref(true);
const drinkCostChartData = ref<DonutDataItem[]>([]);

const chartValues = computed(() =>
  drinkCostChartData.value.map((item) => item.value)
);

const totalCost = computed(() =>
  drinkCostChartData.value.reduce((sum, item) => sum + item.value, 0).toFixed(2)
);

async function loadDrinkCostDistributionChart() {
  try {
    isLoading.value = true;

    const res = await $fetch<DonutDataItem[]>(
      "/api/reports/drink-cost-distribution"
    );

    if (res.length > 0) {
      drinkCostChartData.value = res;
    }
  } catch (e) {
    console.error("Erro capturado em loadDrinkCostDistributionChart:", e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadDrinkCostDistributionChart();
});
</script>

<template>
  <v-card elevation="2" rounded="xl" class="pa-4 border-sm" min-height="400">
    <v-card-title>Top 10 drinks por custo</v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <template v-else>
        <DonutChart
          :data="chartValues"
          :height="300"
          :labels="drinkCostChartData"
          :hide-legend="true"
          :radius="0"
        >
          <div style="position: absolute; text-align: center">
            <div class="font-semibold">Custo Total</div>
            <div class="text-muted">R$ {{ totalCost }}</div>
          </div>
        </DonutChart>
      </template>
    </v-card-text>
  </v-card>
</template>
