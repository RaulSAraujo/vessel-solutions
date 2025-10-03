<script lang="ts" setup>
const menus = [
  {
    title: "Cadastro",
    items: [
      {
        title: "Clientes",
        to: "/clients",
      },
      {
        title: "Ingredientes",
        to: "/#1",
      },
      {
        title: "Drinks",
        to: "/#2",
      },
      {
        title: "Eventos",
        to: "/#3",
      },
    ],
  },
];
</script>

<template>
  <v-menu v-for="(menu, index) in menus" :key="index" offset="10">
    <template #activator="{ props }">
      <v-btn v-bind="props"> {{ menu.title }} </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="(item, i) in menu.items" :key="i" :to="item.to">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
