<script lang="ts" setup>
import CardIcon from "./ui/CardIcon.vue";
</script>

<template>
  <v-row class="how-it-works-section py-16">
    <v-container>
      <h2 class="text-h3 text-center mb-12">
        Sua Gestão de Coquetelaria em 3 Passos Simples
      </h2>

      <v-row justify="center">
        <v-col cols="12" md="6" lg="4">
          <CardIcon
            title="Organize Seus Eventos"
            description="Cadastre clientes, locais, datas e detalhes. Deixe o Vessel calcular a demanda de drinks e recursos."
            icon="mdi-numeric-1-circle-outline"
            color="primary"
          />
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <CardIcon
            title="Gerencie Receitas e Ingredientes"
            description="Crie drinks, adicione ingredientes e controle custos. Otimize suas compras com listas inteligentes."
            icon="mdi-numeric-2-circle-outline"
            color="success"
          />
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <CardIcon
            title="Analise e Otimize Lucros"
            description="Tenha relatórios detalhados de lucratividade por evento e drink, e tome decisões estratégicas."
            icon="mdi-numeric-3-circle-outline"
            color="info"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<style scoped>
.how-it-works-section {
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-background)),
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-background))
  );
}
</style>
