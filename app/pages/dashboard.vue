<script setup lang="ts">
import { useClientsApi } from "~/composables/api/useClientsApi";
import { useEventsApi } from "~/composables/api/useEventsApi";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const loading = ref(true);
const apiError = ref<string | null>(null);

// --- KPIs ---
const totalEvents = ref(0);
const totalProfit = ref(0);
const totalClients = ref(0);

// --- Chart Data ---
const monthlyEventsChart = ref({
  series: [] as { name: string; data: number[] }[],
  options: {
    chart: {
      id: "monthly-events-chart",
    },
    xaxis: {
      categories: [] as string[],
      title: { text: "Mês" },
    },
    yaxis: {
      title: { text: "Número de Eventos" },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " eventos";
        },
      },
    },
  },
});

const profitSummaryChart = ref({
  series: [] as { name: string; data: number[] }[],
  options: {
    chart: {
      id: "profit-summary-chart",
    },
    xaxis: {
      categories: [] as string[],
      title: { text: "Mês" },
    },
    yaxis: {
      title: { text: "Valor (R$)" },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "R$ " + val.toFixed(2);
        },
      },
    },
  },
});

const drinkCostDistributionChart = ref({
  series: [] as { name: string; data: number }[], // NuxtChart expects data directly for donut
  options: {
    chart: {
      id: "drink-cost-distribution-chart",
    },
    labels: [] as string[], // Labels for donut chart
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "R$ " + val.toFixed(2);
        },
      },
    },
  },
});

// --- API Calls ---
const fetchDashboardData = async () => {
  loading.value = true;
  apiError.value = null;
  try {
    // Fetch KPIs
    const clientsApi = useClientsApi();
    const allClients = await clientsApi.fetchClients();
    if (allClients) {
      totalClients.value = allClients.length;
    }

    const eventsApi = useEventsApi();
    const allEvents = await eventsApi.fetchEvents();
    if (allEvents) {
      totalEvents.value = allEvents.length;
      totalProfit.value = allEvents.reduce(
        (sum, event) => sum + (event.gross_profit || 0),
        0
      );
    }

    // Fetch Chart Data
    const { data: monthlyEventsData, error: monthlyEventsError } =
      await useFetch("/api/reports/monthly-events");
    if (monthlyEventsError.value) throw monthlyEventsError.value;
    if (monthlyEventsData.value) {
      monthlyEventsChart.value.series = monthlyEventsData.value.series;
      monthlyEventsChart.value.options.xaxis.categories =
        monthlyEventsData.value.categories;
    }

    const { data: profitSummaryData, error: profitSummaryError } =
      await useFetch("/api/reports/profit-summary");
    if (profitSummaryError.value) throw profitSummaryError.value;
    if (profitSummaryData.value) {
      profitSummaryChart.value.series = profitSummaryData.value.series;
      profitSummaryChart.value.options.xaxis.categories =
        profitSummaryData.value.categories;
    }

    const { data: drinkCostData, error: drinkCostError } = await useFetch(
      "/api/reports/drink-cost-distribution"
    );
    if (drinkCostError.value) throw drinkCostError.value;
    if (drinkCostData.value) {
      drinkCostDistributionChart.value.series = drinkCostData.value.series;
      drinkCostDistributionChart.value.options.labels =
        drinkCostData.value.series.map((s) => s.name);
    }
  } catch (e: any) {
    apiError.value = e.message || "Erro ao carregar dados do dashboard.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Dashboard</h1>
    <p class="mb-6">
      Visão geral e métricas importantes do seu negócio de coquetelaria.
    </p>

    <v-alert v-if="apiError" type="error" class="mb-4">{{ apiError }}</v-alert>

    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <!-- KPIs Section -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon size="48" color="primary">mdi-calendar-check</v-icon>
          <v-card-title class="text-h5">{{ totalEvents }}</v-card-title>
          <v-card-subtitle>Eventos Realizados</v-card-subtitle>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon size="48" color="success">mdi-currency-usd</v-icon>
          <v-card-title class="text-h5">
            R$ {{ totalProfit.toFixed(2) }}
          </v-card-title>
          <v-card-subtitle>Lucro Bruto Total</v-card-subtitle>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon size="48" color="info">mdi-account-group</v-icon>
          <v-card-title class="text-h5">{{ totalClients }}</v-card-title>
          <v-card-subtitle>Clientes Ativos</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Eventos por Mês</v-card-title>
          <v-card-text>
            <NuxtChart
              v-if="monthlyEventsChart.series.length > 0"
              type="bar"
              :options="monthlyEventsChart.options"
              :series="monthlyEventsChart.series"
            />
            <v-skeleton-loader v-else type="image" height="300" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Lucro Bruto vs. Investimento (Mensal)</v-card-title>
          <v-card-text>
            <NuxtChart
              v-if="profitSummaryChart.series.length > 0"
              type="line"
              :options="profitSummaryChart.options"
              :series="profitSummaryChart.series"
            />
            <v-skeleton-loader v-else type="image" height="300" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Top 10 Drinks por Custo Unitário</v-card-title>
          <v-card-text>
            <NuxtChart
              v-if="drinkCostDistributionChart.series.length > 0"
              type="donut"
              :options="drinkCostDistributionChart.options"
              :series="drinkCostDistributionChart.series.map((s) => s.data)"
            />
            <v-skeleton-loader v-else type="image" height="300" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Adicione mais gráficos aqui -->
      <v-col cols="12" md="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-card-title>Outras Métricas</v-card-title>
          <v-card-text>
            <v-icon size="64" color="grey">mdi-chart-box-outline</v-icon>
            <p class="mt-4">Mais gráficos em breve!</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
}
</style>
