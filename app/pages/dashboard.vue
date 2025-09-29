<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const user = useSupabaseUser();
const client = useSupabaseClient();
</script>

<template>
  <div>
    <v-btn @click="client.auth.signOut()">Logout</v-btn>

    <pre>{{ user }}</pre>
  </div>
</template>
