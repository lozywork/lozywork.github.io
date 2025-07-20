// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Lonny Zeindler',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    {
      path: '~/components',
    },
  ],

  googleFonts: {
    families: {
      Inter: [400, 500, 700], // Define the weights you need
    },
    display: 'swap', // Improves loading performance
  },

  compatibilityDate: '2025-04-09',
});