<script lang="ts" setup></script>

<template>
  <v-row class="d-flex align-center py-16">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <h2 class="text-h3 mb-6">
            Nossa Missão: Impulsionar sua Coquetelaria
          </h2>

          <p class="text-h6 mb-4">
            Na Vessel, acreditamos que a paixão pela coquetelaria deve ser
            acompanhada por uma gestão eficiente e inteligente. Nascemos da
            necessidade de simplificar processos complexos, oferecendo uma
            plataforma robusta e intuitiva para o mercado B2B.
          </p>

          <p class="text-h6">
            Nosso objetivo é capacitar bares, restaurantes e empresas de eventos
            a otimizar cada etapa, desde a criação de receitas até a análise de
            lucratividade, garantindo que cada drink servido contribua para o
            sucesso do seu negócio.
          </p>

          <v-btn to="/auth/register" color="primary" size="large" class="mt-6">
            Saiba Mais
          </v-btn>
        </v-col>

        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
            max-width="400"
            class="rounded-lg elevation-4"
            alt="Equipe Vessel trabalhando"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>
