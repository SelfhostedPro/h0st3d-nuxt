import { defineStore } from 'pinia'
import type { ExternalPluginManifest, Plugin, PluginManifest, PluginRegistry } from '~~/types'

export const usePluginStore = defineStore('plugin', {
    state: () => ({
        downloadedPlugins: {} as Record<string, Plugin>,
        registries: [] as PluginRegistry[],
        registryPlugins: {} as { [key: string]: ExternalPluginManifest[] },
        isLoading: false,
        isRegistryLoading: false,
        error: null as string | null,
        registryError: null as string | null
    }),

    actions: {
        async downloadPlugin(plugin: { name: string, registry: string }) {
            this.isLoading = true
            this.error = null
            try {
                await $fetch('/api/plugins/download', {
                    method: 'POST',
                    body: plugin
                })
                await this.refreshPlugins()
            } catch (err: any) {
                this.error = err.message || 'Failed to install plugin'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        async refreshPlugins() {
            this.isLoading = true
            try {
                const response = await $fetch<Record<string, Plugin>>('/api/plugins/list')
                this.downloadedPlugins = response
            } catch (err: any) {
                console.error('Failed to refresh plugins:', err)
                this.error = 'Failed to load plugins'
                this.downloadedPlugins = {}
            } finally {
                this.isLoading = false
            }
        },
        // async togglePlugin(name: string, enabled: boolean) {
        //     this.isLoading = true
        //     try {
        //         await $fetch('/api/plugins/toggle', {
        //             method: 'POST',
        //             body: { name, enabled }
        //         })
        //         await this.refreshPlugins()
        //     } catch (err: any) {
        //         this.error = err.message || 'Failed to toggle plugin'
        //         throw err
        //     } finally {
        //         this.isLoading = false
        //     }
        // },
        async enablePlugin(id: string) {
            this.isLoading = true
            try {
                await $fetch('/api/plugins/enable', {
                    method: 'POST',
                    body: { id }
                })
                await this.refreshPlugins()
            } catch (err: any) {
                this.error = err.message || 'Failed to enable plugin'
                throw err
            } finally {
                this.isLoading = false
            }
        },
        async disablePlugin(id: string) {
            this.isLoading = true
            try {
                await $fetch('/api/plugins/disable', {
                    method: 'POST',
                    body: { id }
                })
                await this.refreshPlugins()
            } catch (err: any) {
                this.error = err.message || 'Failed to enable plugin'
                throw err
            } finally {
                this.isLoading = false
            }
        },
        async removePlugin(name: string) {
            this.isLoading = true
            try {
                console.log('Removing plugin:', name)
                await $fetch(`/api/plugins/remove?name=${encodeURIComponent(name)}`, {
                    method: 'DELETE'
                })
                await this.refreshPlugins()
            } catch (err: any) {
                this.error = err.message || 'Failed to remove plugin'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        async addRegistry(registry: { name: string, url: string, type: string }) {
            this.isRegistryLoading = true
            this.registryError = null
            try {
                await $fetch('/api/plugins/registries', {
                    method: 'POST',
                    body: registry
                })
                await this.getRegistries()
            } catch (err: any) {
                this.registryError = err.message || 'Failed to add registry'
                throw err
            } finally {
                this.isRegistryLoading = false
            }
        },

        async removeRegistry(name: string) {
            this.isRegistryLoading = true
            this.registryError = null
            try {
                await $fetch(`/api/plugins/registries?name=${encodeURIComponent(name)}`, {
                    method: 'DELETE'
                })
                await this.getRegistries()
            } catch (err: any) {
                this.registryError = err.message || 'Failed to remove registry'
                throw err
            } finally {
                this.isRegistryLoading = false
            }
        },

        async getRegistries() {
            this.isRegistryLoading = true
            try {
                const response = await $fetch<PluginRegistry[]>('/api/plugins/registries')
                this.registries = response
            } catch (err: any) {
                this.registryError = 'Failed to load registries'
                this.registries = []
            } finally {
                this.isRegistryLoading = false
            }
        },

        async getRegistryPlugins() {
            this.isRegistryLoading = true
            try {
                const response = await $fetch<{ [key: string]: ExternalPluginManifest[] }>('/api/plugins/registry-plugins')
                this.registryPlugins = response
            } catch (err: any) {
                this.registryError = err.message || 'Failed to get registry plugins'
                throw err
            } finally {
                this.isRegistryLoading = false
            }
        },

        clearErrors() {
            this.error = null
            this.registryError = null
        }
    }
})