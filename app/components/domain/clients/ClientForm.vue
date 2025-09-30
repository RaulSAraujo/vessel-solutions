<script setup lang="ts">
import { ref, watch } from "vue";
import type { Tables, TablesInsert, TablesUpdate } from "~/types/database";
import { useValidation } from "~/composables/useValidation"; // Vamos criar este composable

const props = defineProps<{
  client?: Tables<"clients"> | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit", "cancel"]);

const { rules } = useValidation();

const formData = ref<TablesInsert<"clients"> | TablesUpdate<"clients">>({
  name: "",
  email: null,
  phone: null,
  tax_id: null,
  address: null,
  city: null,
});

watch(
  () => props.client,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal };
    } else {
      // Reset form for new client
      formData.value = {
        name: "",
        email: null,
        phone: null,
        tax_id: null,
        address: null,
        city: null,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  // Basic form validation check (Vee-validate/Yup would be more robust here)
  if (!formData.value.name) {
    alert("O nome do cliente é obrigatório.");
    return;
  }
  emit("submit", formData.value);
};
</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="formData.name"
      label="Nome do Cliente"
      :rules="[rules.required]"
      variant="outlined"
      class="mb-4"
    />
    <v-text-field
      v-model="formData.email"
      label="E-mail"
      type="email"
      :rules="[rules.email]"
      variant="outlined"
      class="mb-4"
    />
    <v-text-field
      v-model="formData.phone"
      label="Telefone"
      variant="outlined"
      class="mb-4"
    />
    <v-text-field
      v-model="formData.tax_id"
      label="CPF/CNPJ"
      variant="outlined"
      class="mb-4"
    />
    <v-text-field
      v-model="formData.address"
      label="Endereço"
      variant="outlined"
      class="mb-4"
    />
    <v-text-field
      v-model="formData.city"
      label="Cidade"
      variant="outlined"
      class="mb-4"
    />

    <v-btn type="submit" color="primary" :loading="loading">Salvar</v-btn>
    <v-btn variant="text" class="ml-2" @click="$emit('cancel')">Cancelar</v-btn>
  </v-form>
</template>
