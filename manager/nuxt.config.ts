import type { HookResult } from "@nuxt/schema";
import type { Serializable } from 'node:child_process'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  app: {
    baseURL: '/manager/'
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
    // preset: 'bun',
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
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ]
})

declare module '#app' {
  interface RuntimeNuxtHooks {
    'your-nuxt-runtime-hook': () => HookResult
  }
  interface NuxtHooks {
    'your-nuxt-hook': () => HookResult
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'base:message': (message: Serializable) => void;
    'base:rebuild': (reason?: string) => void;
    'base:error': () => void;
  }
}