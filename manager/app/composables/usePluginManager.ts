import { ref } from 'vue'
import type { Plugin, PluginManifest, PluginRegistry } from '~~/types'

export const usePluginManager = () => {
  const installedPlugins = ref<Plugin[]>([])
  const registries = ref<PluginRegistry[]>([])
  const registryPlugins = ref<{ [key: string]: PluginManifest[] }>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const installPlugin = async (plugin: { name: string, provider: string }) => {
    isLoading.value = true
    error.value = null
    try {
      await $fetch('/api/plugins/install', {
        method: 'POST',
        body: plugin
      })
      await refreshPlugins()
    } catch (err: any) {
      error.value = err.message || 'Failed to install plugin'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshPlugins = async () => {
    try {
      const response = await $fetch<Record<string, Plugin>>('/api/plugins/list')
      installedPlugins.value = Object.values(response)
    } catch (err: any) {
      console.error('Failed to refresh plugins:', err)
      error.value = 'Failed to load plugins'
      installedPlugins.value = []
    }
  }

  const togglePlugin = async (name: string, enabled: boolean) => {
    try {
      await $fetch('/api/plugins/toggle', {
        method: 'POST',
        body: { name, enabled }
      })
      await refreshPlugins()
    } catch (err: any) {
      error.value = err.message || 'Failed to toggle plugin'
      throw err
    }
  }

  const removePlugin = async (name: string) => {
    try {
      await $fetch(`/api/plugins/remove?name=${encodeURIComponent(name)}`, {
        method: 'DELETE'
      })
      await refreshPlugins()
    } catch (err: any) {
      error.value = err.message || 'Failed to remove plugin'
      throw err
    }
  }

  const getRegistries = async () => {
    try {
      registries.value = await $fetch('/api/plugins/registries')
    } catch (err: any) {
      error.value = 'Failed to load registries'
      registries.value = []
    }
  }

  const getRegistryPlugins = async () => {
    try {
      registryPlugins.value = await $fetch(`/api/plugins/registry-plugins`)
    } catch (err: any) {
      error.value = err.message || 'Failed to get registry plugins'
      throw err
    }
  }

  const addRegistry = async (registry: { name: string, url: string, type: string }) => {
    console.log('Adding Registry', registry)
    try {
      await $fetch('/api/plugins/registries', {
        method: 'POST',
        body: registry
      })
      await getRegistries()
    } catch (err: any) {
      error.value = err.message || 'Failed to add registry'
      throw err
    }
  }

  const removeRegistry = async (name: string) => {
    try {
      await $fetch(`/api/plugins/registries?name=${encodeURIComponent(name)}`, {
        method: 'DELETE'
      })
      await getRegistries()
    } catch (err: any) {
      error.value = err.message || 'Failed to remove registry'
      throw err
    }
  }

  const getRegistryPlugin = async (registry: string) => {
    try {
      return await $fetch(`/api/plugins/registry-plugins?registry=${encodeURIComponent(registry)}`)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch registry plugins'
      throw err
    }
  }

  // Initialize
  refreshPlugins()
  getRegistries()

  return {
    installedPlugins,
    registries,
    isLoading,
    error,
    installPlugin,
    togglePlugin,
    removePlugin,
    refreshPlugins,
    getRegistries,
    addRegistry,
    removeRegistry,
    getRegistryPlugins
  }
}
