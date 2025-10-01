<script setup lang="ts">
defineOptions({
  name: "DefaultLayout",
});
</script>
<template>
  <v-app>
    <Header />

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
