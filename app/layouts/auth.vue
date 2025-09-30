<script setup lang="ts">
import logoVessel from "~/assets/images/logo-vessel.png";
</script>

<template>
  <v-app>
    <v-main
      class="d-flex align-center justify-center"
      style="
        background-image: url('/login-page.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
      "
    >
      <v-overlay
        :model-value="true"
        persistent
        absolute
        opacity="0.6"
        color="black"
        z-index="1"
      />

      <v-container fluid style="z-index: 99">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <div class="text-center mb-8">
              <v-img
                :src="logoVessel"
                alt="Vessel Logo"
                max-width="150"
                class="mx-auto mb-4"
                rounded="xl"
              />
            </div>

            <v-sheet class="pa-8 rounded-xl elevation-2">
              <slot />
            </v-sheet>

            <div class="text-center mt-4 text-caption text-white">
              <NuxtLink to="#" class="text-decoration-none text-white mr-2">
                Termos
              </NuxtLink>

              <NuxtLink to="#" class="text-decoration-none text-white mr-2">
                Privacidade
              </NuxtLink>

              <NuxtLink to="#" class="text-decoration-none text-white">
                Segurança
              </NuxtLink>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
