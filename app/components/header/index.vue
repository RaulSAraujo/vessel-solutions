<script lang="ts" setup>
import Menu from "./Menu.vue";
</script>

<template>
  <v-app-bar app>
    <v-btn-group variant="plain" divided>
      <v-btn icon="mdi-home" to="/" />

      <v-btn text="Clientes" to="/clients" />
    </v-btn-group>

    <v-spacer />

    <Menu />
  </v-app-bar>
</template>
