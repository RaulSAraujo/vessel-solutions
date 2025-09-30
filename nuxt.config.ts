import { pt } from 'vuetify/locale'
import colors from 'vuetify/lib/util/colors.mjs'

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
    'nuxt-charts',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@vee-validate/nuxt',
    'vuetify-nuxt-module',
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
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: colors.blue.darken2,
              accent: colors.grey.darken3,
              secondary: colors.amber.darken3,
              info: colors.teal.lighten1,
              warning: colors.amber.base,
              error: colors.deepOrange.accent4,
              success: colors.green.accent3,
              surface: colors.grey.darken4,
              'surface-bright': '#272727',
              'surface-light': '#272727',
              'surface-variant': colors.grey.darken3,
              'on-surface-variant': colors.grey.lighten3,
            }
          },
          light: {
            dark: false,
            colors: {
              primary: colors.blue.darken2,
              accent: colors.grey.darken3,
              secondary: colors.amber.darken3,
              info: colors.teal.lighten1,
              warning: colors.amber.base,
              error: colors.deepOrange.accent4,
              success: colors.green.accent3,
              surface: colors.grey.lighten5,
              'surface-bright': colors.grey.lighten5,
              'surface-light': colors.grey.lighten3,
              'surface-variant': colors.grey.darken3,
              'on-surface-variant': colors.grey.lighten3,
            },
          },
        },
      },
    },
  },
})