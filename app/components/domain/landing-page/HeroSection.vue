<script lang="ts" setup></script>

<template>
  <v-parallax
    src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    height="600"
    class="d-flex align-center justify-center text-center"
  >
    <v-col cols="12" md="8" class="text-white" style="z-index: 1">
      <h1 class="text-h2 font-weight-bold mb-4">
        Vessel: A Gestão Inteligente para sua Coquetelaria B2B
      </h1>

      <p class="text-h5 mb-8">
        Otimize eventos, controle ingredientes e maximize seus lucros com nossa
        plataforma completa.
      </p>

      <v-btn
        rounded="lg"
        class="mr-4"
        color="white"
        size="x-large"
        variant="flat"
        to="/auth/register"
        text="Comece Agora"
      />

      <v-btn
        rounded="lg"
        color="white"
        size="x-large"
        to="/auth/login"
        variant="outlined"
        text="Já sou Cliente"
      />
    </v-col>
  </v-parallax>
</template>
