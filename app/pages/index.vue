<script setup lang="ts">
definePageMeta({
  layout: "guest", // Layout para visitantes
  middleware: ["auth"],
});
</script>

<template>
  <v-container fluid class="pa-0">
    <LandingPageHeroSection />

    <LandingPageFeaturesSection />

    <LandingPageHowItWorksSection />

    <LandingPageAboutSection />

    <LandingPageTestimonialsSection />

    <LandingPageFaqSection />

    <LandingPageActionSection />
  </v-container>
</template>
