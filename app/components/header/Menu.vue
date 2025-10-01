<script lang="ts" setup>
import { useAuthApi } from "~/composables/api/useAuthApi";
import LogoVessel from "~/assets/images/logo-vessel.png";

const theme = useTheme();
const useAuth = useAuthApi();

const logout = async () => {
  await useAuth.logout();
  await navigateTo("/");
};
</script>

<template>
  <v-menu location="bottom end" offset="15">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="mr-5">
        <v-avatar size="large" :image="LogoVessel" />
      </v-btn>
    </template>

    <v-card width="200" rounded="lg">
      <v-list density="compact" lines="one">
        <v-list-item
          title="Alterar tema"
          prepend-icon="mdi-theme-light-dark"
          @click="theme.cycle()"
        />

        <v-divider />

        <v-list-item
          title="Profile"
          prepend-icon="mdi-account"
          @click="console.log('profile')"
        />

        <v-divider />

        <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout" />
      </v-list>
    </v-card>
  </v-menu>
</template>
