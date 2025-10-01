<script setup lang="ts">
import { authSchema } from "~/schemas/auth";
import { useAuthApi } from "~/composables/api/useAuthApi";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

const { loading, errorMessage, login } = useAuthApi();

const { handleSubmit, isSubmitting, meta, errors } = useForm({
  validationSchema: authSchema,
});

const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  const success: boolean = await login(values.email, values.password);

  if (success) {
    await navigateTo("/dashboard");
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <h2 class="text-h6 text-center mb-6">Entrar no Vessel</h2>

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
      rounded="lg"
      color="primary"
      :loading="loading"
      :disabled="!meta.valid || isSubmitting"
    >
      Entrar
    </v-btn>

    <v-alert v-if="errorMessage" type="error" class="mb-4" density="compact">
      {{ errorMessage }}
    </v-alert>

    <v-divider class="my-6">ou</v-divider>

    <v-btn class="mb-4" block variant="outlined" color="gray" rounded="lg">
      <v-icon left class="mr-2">mdi-google-plus</v-icon>
      LOGAR COM GOOGLE
    </v-btn>

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
