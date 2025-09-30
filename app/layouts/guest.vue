<template>
  <v-app>
    <v-app-bar app flat>
      <v-toolbar-title>Vessel</v-toolbar-title>
      <v-spacer />
      <v-btn to="/auth/login" text>Login</v-btn>
      <v-btn to="/auth/register" color="primary">Registrar</v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer class="bg-grey-lighten-4">
      <v-container class="text-center text-caption">
        &copy; {{ new Date().getFullYear() }} Vessel. Todos os direitos
        reservados.
      </v-container>
    </v-footer>
  </v-app>
</template>
