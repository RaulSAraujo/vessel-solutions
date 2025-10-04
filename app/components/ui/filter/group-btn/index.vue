<script lang="ts" setup>
import BtnClear from "./Clear.vue";
import BtnSearch from "./Search.vue";

defineEmits(["clear", "search"]);
</script>

<template>
  <div class="d-flex align-center justify-center">
    <BtnClear @clear="$emit('clear')" />

    <BtnSearch @search="$emit('search')" />
  </div>
</template>
