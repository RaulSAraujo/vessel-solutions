<script setup lang="ts">
const theme = useTheme();
</script>

<template>
  <v-app>
    <v-app-bar app flat>
      <v-toolbar-title>Vessel</v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-palette" @click="theme.cycle()" />

      <v-btn to="/auth/login" text>Login</v-btn>

      <v-btn to="/auth/register" color="primary">Registrar</v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer
      height="40"
      class="footer d-flex justify-center text-caption mt-3"
    >
      &copy; {{ new Date().getFullYear() }} Vessel. Todos os direitos
      reservados.
    </v-footer>
  </v-app>
</template>

<style scoped>
.footer {
  color: white;
  background-color: rgb(var(--v-theme-primary));
}
</style>
