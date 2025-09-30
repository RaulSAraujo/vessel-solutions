<script setup lang="ts">
defineOptions({
  name: "DefaultLayout",
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const drawer = ref(false);

const logout = async () => {
  await authStore.logout();
  await navigateTo("/");
};
</script>
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          to="/"
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
        />
        <v-list-item
          to="/clients"
          prepend-icon="mdi-account-group"
          title="Clientes"
        />
        <v-list-item
          to="/ingredients"
          prepend-icon="mdi-food-apple"
          title="Ingredientes"
        />
        <v-list-item
          to="/drinks"
          prepend-icon="mdi-glass-cocktail"
          title="Drinks"
        />
        <v-list-item
          to="/events"
          prepend-icon="mdi-calendar-check"
          title="Eventos"
        />
        <v-list-item
          to="/purchase-lists"
          prepend-icon="mdi-cart"
          title="Listas de Compras"
        />
      </v-list>

      <template #append>
        <v-list-item prepend-icon="mdi-logout" title="Sair" @click="logout" />
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Vessel - Gestão de Coquetelaria</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <span class="mr-2">{{ user?.email }}</span>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
