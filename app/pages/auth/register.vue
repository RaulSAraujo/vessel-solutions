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
const registrationSuccess: Ref<boolean> = ref(false);

const handleRegister = async (): Promise<void> => {
  const success: boolean = await authStore.register(
    email.value,
    password.value
  );
  if (success) {
    registrationSuccess.value = true;
    // Opcional: redirecionar após um tempo ou manter na página com a mensagem
    // setTimeout(() => navigateTo('/auth/login'), 3000);
  }
};
</script>

<template>
  <v-form @submit.prevent="handleRegister">
    <h2 class="text-h6 text-center mb-6 text-grey-darken-3">
      Criar sua Conta Vessel
    </h2>

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
      Registrar
    </v-btn>

    <v-alert v-if="authStore.error" type="error" class="mb-4" density="compact">
      {{ authStore.error }}
    </v-alert>
    <v-alert
      v-if="registrationSuccess"
      type="success"
      class="mb-4"
      density="compact"
    >
      Registro realizado! Verifique seu e-mail para confirmar a conta.
    </v-alert>

    <div class="text-center text-caption">
      <NuxtLink to="/auth/login" class="text-decoration-none text-primary">
        Já tem uma conta? Faça login
      </NuxtLink>
    </div>
  </v-form>
</template>
