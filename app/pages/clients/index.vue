<script setup lang="ts">
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { Tables, TablesInsert, TablesUpdate } from "~/types/database";

definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const api = useClientsApi();
const clients = ref<Tables<"clients">[]>([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const isEditMode = ref(false);
const selectedClient = ref<Tables<"clients"> | null>(null);
const clientToDelete = ref<Tables<"clients"> | null>(null);

const headers = [
  { title: "Nome", key: "name" },
  { title: "E-mail", key: "email" },
  { title: "Telefone", key: "phone" },
  { title: "Cidade", key: "city" },
  { title: "Ações", key: "actions", sortable: false },
];

const loadClients = async () => {
  const data = await api.fetchClients();
  if (data) {
    clients.value = data;
  }
};

onMounted(loadClients);

const openCreateDialog = () => {
  isEditMode.value = false;
  selectedClient.value = null;
  dialog.value = true;
};

const openEditDialog = (client: Tables<"clients">) => {
  isEditMode.value = true;
  selectedClient.value = { ...client }; // Clone para evitar mutação direta
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  selectedClient.value = null;
};

const handleFormSubmit = async (
  formData: TablesInsert<"clients"> | TablesUpdate<"clients">
) => {
  if (isEditMode.value && selectedClient.value) {
    const updatedClient = await api.updateClient(
      selectedClient.value.id,
      formData
    );
    if (updatedClient) {
      closeDialog();
      await loadClients();
    }
  } else {
    const newClient = await api.createClient(formData);
    if (newClient) {
      closeDialog();
      await loadClients();
    }
  }
};

const confirmDelete = (client: Tables<"clients">) => {
  clientToDelete.value = client;
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  clientToDelete.value = null;
};

const deleteClient = async () => {
  if (clientToDelete.value) {
    const success = await api.deleteClient(clientToDelete.value.id);
    if (success) {
      closeDeleteDialog();
      await loadClients();
    }
  }
};
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Clientes</h1>

    <v-row class="mb-4">
      <v-col>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          Novo Cliente
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="api.errorMessage.value" type="error" class="mb-4">
      {{ api.errorMessage.value }}
    </v-alert>

    <v-progress-linear v-if="api.loading.value" indeterminate color="primary" />

    <v-card v-if="clients && clients.length > 0">
      <v-data-table
        :headers="headers"
        :items="clients"
        item-key="id"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="confirmDelete(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-alert v-else-if="!api.loading.value" type="info"
      >Nenhum cliente cadastrado.</v-alert
    >

    <!-- Dialog para Criar/Editar Cliente -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            isEditMode ? "Editar Cliente" : "Novo Cliente"
          }}</span>
        </v-card-title>
        <v-card-text>
          <ClientsClientForm
            :client="selectedClient"
            :loading="api.loading.value"
            @submit="handleFormSubmit"
            @cancel="closeDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text
          >Tem certeza que deseja excluir o cliente "{{
            clientToDelete?.name
          }}"?</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue-darken-1" variant="text" @click="closeDeleteDialog"
            >Cancelar</v-btn
          >
          <v-btn color="red-darken-1" variant="text" @click="deleteClient"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
