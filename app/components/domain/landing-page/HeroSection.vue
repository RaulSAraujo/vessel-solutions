<script lang="ts" setup>
import ImageParallax from "~/assets/images/parallax.png";
</script>

<template>
  <v-parallax
    :src="ImageParallax"
    :scale="0.6"
    height="600"
    class="d-flex align-center pl-6"
  >
    <div
      style="
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
      "
    />

    <v-row>
      <v-col cols="12" md="8" class="text-white" style="z-index: 99">
        <h1 class="text-h2 font-weight-bold mb-4">
          Vessel: A Gestão Inteligente para sua Coquetelaria
        </h1>

        <p class="text-h5 mb-8">
          Otimize eventos, controle ingredientes e maximize seus lucros com
          nossa plataforma completa.
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
    </v-row>
  </v-parallax>
</template>
