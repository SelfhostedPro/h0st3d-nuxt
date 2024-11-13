// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    // preset: 'bun',
    storage: {
      data: {
        driver: 'fs',
        base: `${import.meta.env.DATA_DIR || '../data'}/base`
      }
    },
  },
  routeRules: {
    '/manager/**': { proxy: { to: 'http://localhost:3005/manager/**' } }
  },
  devtools: { enabled: false }
})
