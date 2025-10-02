<script lang="ts" setup>
interface ChartDataItem {
  month: string;
  "Número de Eventos": number;
}

interface ChartCategories {
  [key: string]: {
    name: string;
    color: string;
  };
}

const isLoading = ref(true);
const chartData = ref<ChartDataItem[]>([]);
const chartLegendCategories = ref<ChartCategories>({});

const xFormatter = (i: number): string => {
  return chartData.value[i]?.month || "";
};

const yFormatter = (tick: number) => tick.toString();

async function loadMonthlyEventsChart() {
  try {
    isLoading.value = true;

    const res = await $fetch("/api/reports/monthly-events");

    if (res.data) {
      chartData.value = res.data;
      chartLegendCategories.value = res.categories;
    } else {
      // Caso não haja dados, limpa as variáveis do gráfico
      chartData.value = [];
      chartLegendCategories.value = {};
      console.warn("Nenhum dado de eventos mensais recebido.");
    }
  } catch (error) {
    console.error("Erro ao carregar o gráfico de eventos mensais:", error);
  } finally {
    isLoading.value = false; // Desativa o estado de carregamento
  }
}

onMounted(() => {
  loadMonthlyEventsChart();
});
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" min-height="400">
    <v-card-title>Eventos por mês</v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <template v-else>
        <BarChart
          :data="chartData"
          :height="300"
          :categories="chartLegendCategories"
          :y-axis="['Número de Eventos']"
          :x-num-ticks="chartData.length"
          :radius="10"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.Top"
          :hide-legend="true"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
