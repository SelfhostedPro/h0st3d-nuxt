import { useStorage } from '#imports'
import type { PluginManifest, PluginRegistry } from '~~/types'
import type { TemplateInfo } from 'giget'

/**
 * Manages plugin registries using Nitro's storage
 */
export class PluginRegistryManager {
    private storage = useStorage('data')
    private STORAGE_KEY = 'data:plugins/registries'

    /**
     * Get all registered plugin registries
     */
    async getRegistries(): Promise<PluginRegistry[]> {
        const registries = await this.storage.getItem<PluginRegistry[]>(this.STORAGE_KEY) || []
        return registries
    }

    /**
     * Add a new plugin registry
     */
    async addRegistry(registry: PluginRegistry): Promise<PluginRegistry> {
        const registries = await this.getRegistries()

        // Check for duplicate URLs
        if (registries.some(r => r.url === registry.url)) {
            throw new Error(`Registry with URL ${registry.url} already exists`)
        }
        const test = await useStorage('data')
        const meta = await test.getMeta('data')
        registries.push(registry)
        console.log(`Adding registry: ${registry.url} to ${test} ${meta}`)
        await this.storage.setItem(this.STORAGE_KEY, registries)
        return registry
    }

    async getRegistryPlugins(registryName: string): Promise<PluginManifest[]> {
        const plugins: PluginManifest[] = []
        const registry = await this.getRegistry(registryName)
        if (!registry) {
            throw new Error(`Registry ${registryName} not found`)
        }
        const response = await (await fetch(registry.url)).json() as string[]
        const promises = response.map(async (name) => {
            const pluginRegistryInfo = await (await (await fetch(`${registry.url}/${name}`)).json()) as TemplateInfo
            const pluginInfo = await (await fetch(`${pluginRegistryInfo.url || registry.url + '/' + name}/plugin.json`)).json() as PluginManifest
            plugins.push(pluginInfo)
        })
        await Promise.all(promises)
        return plugins
    }

    /**
     * Remove a plugin registry by URL
     */
    async removeRegistry(url: string): Promise<boolean> {
        const registries = await this.getRegistries()
        const filtered = registries.filter(r => r.url !== url)

        if (filtered.length === registries.length) {
            return false
        }

        await this.storage.setItem(this.STORAGE_KEY, filtered)
        return true
    }

    /**
     * Get a registry by URL
     */
    async getRegistry(url: string): Promise<PluginRegistry | undefined> {
        const registries = await this.getRegistries()
        return registries.find(r => r.url === url)
    }
}

// Export singleton instance
export const pluginRegistry = new PluginRegistryManager()
