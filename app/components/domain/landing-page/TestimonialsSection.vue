<script lang="ts" setup></script>

<template>
  <v-row class="bg-blue-lighten-5 py-16 text-center">
    <v-container>
      <h2 class="text-h3 mb-12">O que Nossos Clientes Dizem</h2>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2">
            <v-avatar size="96" class="mb-4">
              <v-img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="Cliente 1"
              />
            </v-avatar>
            <v-card-text class="text-h6 font-italic">
              "O Vessel revolucionou a forma como gerenciamos nossos eventos. A
              precisão nos custos e a facilidade de criar listas de compras nos
              pouparam horas de trabalho e aumentaram nossa margem de lucro!"
            </v-card-text>
            <v-card-subtitle class="text-h6 font-weight-bold"
              >- João Silva, Gerente de Eventos - Bar do Zé</v-card-subtitle
            >
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2">
            <v-avatar size="96" class="mb-4">
              <v-img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Cliente 2"
              />
            </v-avatar>
            <v-card-text class="text-h6 font-italic">
              "Nunca imaginei que a gestão de ingredientes pudesse ser tão
              simples e eficiente. Com o Vessel, reduzimos o desperdício e temos
              total controle sobre o custo real de cada drink. Essencial para
              nosso negócio!"
            </v-card-text>
            <v-card-subtitle class="text-h6 font-weight-bold"
              >- Maria Oliveira, Proprietária - Coquetelaria
              Fina</v-card-subtitle
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>
