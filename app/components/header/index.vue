<script lang="ts" setup>
import Menu from "./Menu.vue";
import Avatar from "./Avatar.vue";
</script>

<template>
  <v-app-bar app>
    <v-btn-group variant="plain">
      <v-btn icon="mdi-home" to="/" />

      <Menu />
    </v-btn-group>

    <v-spacer />

    <Avatar />
  </v-app-bar>
</template>
