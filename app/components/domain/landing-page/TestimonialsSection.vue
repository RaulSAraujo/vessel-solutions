<script lang="ts" setup>
import CardAvatar from "./ui/CardAvatar.vue";
</script>

<template>
  <v-row class="testimonials-section py-16 text-center">
    <v-container>
      <h2 class="text-h3 mb-12">O que Nossos Clientes Dizem</h2>

      <v-row justify="center">
        <v-col cols="12" md="6">
          <CardAvatar
            image="https://randomuser.me/api/portraits/men/85.jpg"
            image-alt="Cliente 1"
            description="O Vessel revolucionou a forma como gerenciamos nossos eventos. A
              precisão nos custos e a facilidade de criar listas de compras nos
              pouparam horas de trabalho e aumentaram nossa margem de lucro!"
            subtitle="João Silva, Gerente de Eventos - Bar do Zé"
          />
        </v-col>

        <v-col cols="12" md="6">
          <CardAvatar
            image="https://randomuser.me/api/portraits/women/44.jpg"
            image-alt="Cliente 2"
            description="Nunca imaginei que a gestão de ingredientes pudesse ser tão
              simples e eficiente. Com o Vessel, reduzimos o desperdício e temos
              total controle sobre o custo real de cada drink. Essencial para
              nosso negócio!"
            subtitle="Maria Oliveira, Proprietária - Coquetelaria Fina"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<style scoped>
.testimonials-section {
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-background)),
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-background))
  );
}
</style>
