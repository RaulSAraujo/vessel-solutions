<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: ["guest"],
});

const supabase = useSupabaseClient();

const form = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: "",
  password: "",
});

const validateForm = () => {
  errors.value.email = form.value.email.includes("@") ? "" : "Invalid email.";
  errors.value.password =
    form.value.password.length >= 6
      ? ""
      : "Password must be at least 6 characters.";
  return !errors.value.email && !errors.value.password;
};

const submit = async () => {
  if (!validateForm()) return;

  const { error } = await supabase.auth.signInWithPassword({
    email: form.value.email,
    password: form.value.password,
  });

  if (error) {
    alert(error.message);
    return;
  }
};
</script>

<template>
  <v-container>
    <h1>Login</h1>

    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        :error-messages="errors.email"
        required
      />
      <v-text-field
        v-model="form.password"
        label="Password"
        type="password"
        :error-messages="errors.password"
        required
      />
      <v-btn type="submit" color="primary">Login</v-btn>
    </v-form>
  </v-container>
</template>
