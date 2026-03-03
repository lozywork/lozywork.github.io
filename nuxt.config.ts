// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/eslint-module'
  ],
  css: ['~/assets/css/main.scss'],
  components: [
    {
      path: '~/components',
    },
  ],
  routeRules: {
    '/lozy.webp': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  },
  app: {
    head: {
      title: 'Lonny Zeindler',
      link: [
        {
          rel: 'icon',
          type: 'image/png', // Specify the image type as PNG
          href: '/logo.png' // Path relative to the public directory
        }
      ]
    }
    
  }
});
