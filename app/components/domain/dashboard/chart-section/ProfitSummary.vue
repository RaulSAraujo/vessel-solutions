<script lang="ts" setup>
interface ChartDataItem {
  date: string;
  investment: number;
  profit: number;
}

const isLoading = ref(true);
const profitChartData = ref<ChartDataItem[]>([]);

interface BulletLegendItemInterface {
  name: string;
  color: string;
}

const chartCategories: Record<string, BulletLegendItemInterface> = {
  investment: { name: "Investimento Total", color: "#3b82f6" }, // Cor para Investimento
  profit: { name: "Lucro Bruto", color: "#22c55e" }, // Cor para Lucro
};

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return profitChartData.value[tick]?.date ?? "";
};

async function loadProfitSummaryChart() {
  isLoading.value = true;
  try {
    const res = await $fetch<ChartDataItem[]>("/api/reports/profit-summary");

    if (res.length > 0) {
      profitChartData.value = res;
    }
  } catch (e) {
    console.error("Erro capturado em loadProfitSummaryChart:", e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadProfitSummaryChart();
});
</script>

<template>
  <v-card elevation="2" rounded="xl" class="pa-4 border-sm" min-height="400">
    <v-card-title>Lucro Bruto vs. Investimento (Mensal)</v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <template v-else>
        <LineChart
          :data="profitChartData"
          :height="280"
          y-label="Valores"
          :x-num-ticks="4"
          :y-num-ticks="4"
          :categories="chartCategories"
          :x-formatter="xFormatter"
          :y-grid-line="true"
          :curve-type="CurveType.Linear"
          :legend-position="LegendPosition.Top"
          :hide-legend="true"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
