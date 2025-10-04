<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import { useEventsApi } from "~/composables/api/useEventsApi";

import Card from "./Card.vue";

const eventsApi = useEventsApi();
const clientsApi = useClientsApi();

const totalEvents = ref(0);
const totalProfit = ref(0);
const totalClients = ref(0);
const loading = ref(false);

async function fetchKPIs() {
  loading.value = true;

  const allClients = await clientsApi.getClients();
  if (allClients) {
    totalClients.value = allClients.data.length;
  }

  const allEvents = await eventsApi.fetchEvents();
  if (allEvents) {
    totalEvents.value = allEvents.length;
    totalProfit.value = allEvents.reduce((sum, event) => {
      return sum + (event.gross_profit || 0);
    }, 0);
  }

  loading.value = false;
}

onMounted(fetchKPIs);
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <Card
        color="primary"
        :loading="loading"
        :title="totalEvents"
        icon="mdi-calendar-check"
        description="Eventos Realizados"
      />
    </v-col>

    <v-col cols="12" md="4">
      <Card
        color="success"
        :loading="loading"
        icon="mdi-currency-usd"
        description="Lucro Bruto Total"
        :title="`R$ ${totalProfit.toFixed(2)}`"
      />
    </v-col>

    <v-col cols="12" md="4">
      <Card
        color="info"
        :loading="loading"
        :title="totalClients"
        icon="mdi-account-group"
        description="Clientes Ativos"
      />
    </v-col>
  </v-row>
</template>
