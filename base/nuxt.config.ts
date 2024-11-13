// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    // preset: 'bun',
  },
  routeRules: {
    '/manager/**': { proxy: { to: 'http://localhost:3005/manager/**' } }
  },
  devtools: { enabled: true }
})
