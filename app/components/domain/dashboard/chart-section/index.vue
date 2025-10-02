<script lang="ts" setup>
import MonthlyEvents from "./MonthlyEvents.vue";
import ProfitSummary from "./ProfitSummary.vue";
import DrinkCostDistribution from "./DrinkCostDistribution.vue";
</script>

<template>
  <v-row>
    <v-col cols="12" md="8">
      <MonthlyEvents />
    </v-col>

    <v-col cols="12" md="4">
      <DrinkCostDistribution />
    </v-col>

    <v-col cols="12" md="12">
      <ProfitSummary />
    </v-col>
  </v-row>
</template>
