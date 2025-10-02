<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import { useEventsApi } from "~/composables/api/useEventsApi";

import Card from "./Card.vue";

const eventsApi = useEventsApi();
const clientsApi = useClientsApi();

const totalEvents = ref(0);
const totalProfit = ref(0);
const totalClients = ref(0);

async function fetchKPIs() {
  const allClients = await clientsApi.fetchClients();
  if (allClients) {
    totalClients.value = allClients.length;
  }

  const allEvents = await eventsApi.fetchEvents();
  if (allEvents) {
    totalEvents.value = allEvents.length;
    totalProfit.value = allEvents.reduce((sum, event) => {
      return sum + (event.gross_profit || 0);
    }, 0);
  }
}

onMounted(fetchKPIs);
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <Card
        color="primary"
        :title="totalEvents"
        icon="mdi-calendar-check"
        description="Eventos Realizados"
        :loading="clientsApi.loading.value"
      />
    </v-col>

    <v-col cols="12" md="4">
      <Card
        color="success"
        icon="mdi-currency-usd"
        description="Lucro Bruto Total"
        :title="`R$ ${totalProfit.toFixed(2)}`"
        :loading="eventsApi.loading.value"
      />
    </v-col>

    <v-col cols="12" md="4">
      <Card
        color="info"
        :title="totalClients"
        icon="mdi-account-group"
        description="Clientes Ativos"
        :loading="eventsApi.loading.value"
      />
    </v-col>
  </v-row>
</template>
