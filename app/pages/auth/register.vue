<script setup lang="ts">
import { authSchema } from "~/schemas/auth";
import { useAuthApi } from "~/composables/api/useAuthApi";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

const { loading, errorMessage, register } = useAuthApi();

const { handleSubmit, isSubmitting, meta, errors } = useForm({
  validationSchema: authSchema,
});

const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");

const registrationSuccess: Ref<boolean> = ref(false);

const onSubmit = handleSubmit(async (values) => {
  const success: boolean = await register(values.email, values.password);

  if (success) {
    registrationSuccess.value = true;
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <h2 class="text-h6 text-center mb-6">Crie sua conta Vessel</h2>

    <v-row dense class="mb-4">
      <v-col cols="12">
        <UiTextField
          v-model="email"
          label="E-mail"
          type="email"
          :error-messages="errors.email"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="password"
          label="Senha"
          type="password"
          :error-messages="errors.password"
        />
      </v-col>
    </v-row>

    <v-btn
      block
      class="mb-4"
      type="submit"
      color="primary"
      :loading="loading"
      :disabled="!meta.valid || isSubmitting"
    >
      Registrar
    </v-btn>

    <v-alert v-if="errorMessage" type="error" class="mb-4" density="compact">
      {{ errorMessage }}
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
