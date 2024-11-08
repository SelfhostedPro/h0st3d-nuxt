// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  devServer: {
    port: 3005,
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: import.meta.env.DATA_DIR || '../data'
      }
    },
  },
  tailwindcss: {
    config: {
      darkMode: 'class',
      plugins: [],
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@pinia/nuxt']
})