// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@vee-validate/nuxt',
    'vuetify-nuxt-module',
  ],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      include: undefined,
      exclude: [],
      saveRedirectToCookie: false,
    }
  }
})