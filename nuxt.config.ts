import { pt } from 'vuetify/locale'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-br',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },]
    },
  },

  modules: [
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@vee-validate/nuxt',
    'vuetify-nuxt-module',
    'nuxt-charts'
  ],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/confirm',
      include: undefined,
      exclude: [],
      saveRedirectToCookie: false,
    }
  },

  components: [
    '~/components',
    { path: '~/components/domain', prefix: '' },
  ],

  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi'
      },
      locale: {
        locale: 'pt',
        messages: { pt }
      },
      theme: {
        defaultTheme: 'light',
      },
    },
  },
})