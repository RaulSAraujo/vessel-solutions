<script lang="ts" setup>
import CardIcon from "./ui/CardIcon.vue";
</script>

<template>
  <v-container class="py-16">
    <h2 class="text-h3 text-center mb-12">
      Recursos que Transformam seu Negócio
    </h2>

    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <CardIcon
          title="Gestão de Eventos Completa"
          description="Organize cada detalhe, do cliente ao número de convidados, e calcule automaticamente a demanda de drinks."
          icon="mdi-calendar-check"
        />
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <CardIcon
          title="Controle de ingredientes e custos"
          description="Monitore preços, desperdícios e custos reais. Geração automática de listas de compras otimizadas."
          icon="mdi-food-apple"
        />
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <CardIcon
          title="Precificação Inteligente"
          description="Calcule o custo exato de cada drink e defina margens de lucro para maximizar sua rentabilidade."
          icon="mdi-calculator"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
