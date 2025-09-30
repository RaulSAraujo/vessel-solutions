<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

const authStore = useAuthStore();
const email: Ref<string> = ref("");
const password: Ref<string> = ref("");

const handleLogin = async (): Promise<void> => {
  const success: boolean = await authStore.login(email.value, password.value);
  if (success) {
    await navigateTo("/dashboard");
  }
};
</script>

<template>
  <v-form @submit.prevent="handleLogin">
    <h2 class="text-h6 text-center mb-6">Entrar no Vessel</h2>

    <v-text-field
      v-model="email"
      label="E-mail"
      type="email"
      required
      variant="outlined"
      density="compact"
      class="mb-4"
      hide-details="auto"
    />

    <v-text-field
      v-model="password"
      label="Senha"
      type="password"
      required
      variant="outlined"
      density="compact"
      class="mb-4"
      hide-details="auto"
    />

    <v-btn
      type="submit"
      color="primary"
      block
      :loading="authStore.loading"
      class="mb-4"
    >
      Entrar
    </v-btn>

    <v-alert v-if="authStore.error" type="error" class="mb-4" density="compact">
      {{ authStore.error }}
    </v-alert>

    <div class="d-flex flex-column text-center text-caption">
      <NuxtLink to="/auth/register" class="text-decoration-none text-primary">
        Não tem uma conta? Registre-se
      </NuxtLink>

      <!-- <NuxtLink
        to="/auth/forgot-password"
        class="text-decoration-none text-primary"
      >
        Esqueceu a senha?
      </NuxtLink> -->
    </div>
  </v-form>
</template>
