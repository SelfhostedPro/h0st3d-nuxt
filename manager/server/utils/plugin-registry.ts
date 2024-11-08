import { useStorage } from '#imports'
import { PluginManifestSchema, type PluginManifest, type PluginRegistry } from '~~/types'
import type { TemplateInfo } from 'giget'

/**
 * Manages plugin registries using Nitro's storage
 */
export class PluginRegistryManager {
    private storage = useStorage('data')
    private STORAGE_KEY = 'plugins/registries'

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
        registries.push(registry)
        console.log(registry)
        console.log(`Adding registry: ${registry.url} to ${this.STORAGE_KEY}`)
        await this.storage.setItem(this.STORAGE_KEY, registries)
        return registry
    }

    async getRegistryPlugins(registryName?: string): Promise<{ [key: string]: PluginManifest[] }> {
        if (registryName) {
            const registry = await this.getRegistry(registryName)
            if (!registry) {
                throw new Error(`Registry ${registryName} not found`)
            }
            const index = await this.readRegistryIndex(registry)
            return { [registryName]: await this.readRegistryPlugins(registry, index) }
        } else {
            const registries = await this.getRegistries()
            console.log(`Getting plugins for ${registries.length} registries: ${registries.map(r => r.name).join(', ')}`)
            const plugins: { [key: string]: PluginManifest[] } = {}
            for (const registry of registries) {
                const index = await this.readRegistryIndex(registry)
                plugins[registry.name] = await this.readRegistryPlugins(registry, index)
            }
            return plugins
        }
    }

    async readRegistryIndex(registry: PluginRegistry): Promise<string[]> {
        const response = await (await fetch(`${registry.url}/index.json`)).json() as string[]
        return response
    }

    async readRegistryPlugins(registry: PluginRegistry, index: string[]): Promise<PluginManifest[]> {
        const plugins: PluginManifest[] = [];

        for (const name of index) {
            console.log(`Reading plugin ${name} from registry ${registry.url + name}.json`)
            const templateInfo = await (await fetch(`${registry.url + name}.json`)).json() as TemplateInfo;
            const pluginInfo = await (await fetch(`${templateInfo.url}/refs/heads/${templateInfo.version || 'main'}/${templateInfo.subdir}/plugin.json?token=none`)).json() as PluginManifest;
            const isValid = PluginManifestSchema.safeParse(pluginInfo);
            if (isValid.success) {
                plugins.push(pluginInfo);
            } else {
                console.error(`Invalid plugin manifest for ${name}:`, isValid.error);
            }
        }
        if (plugins.length === 0) {
            throw new Error(`No valid plugins found in registry ${registry.name}`);
        }
        return plugins;
    }

    /**
     * Remove a plugin registry by URL
     */
    async removeRegistry(name: string): Promise<boolean> {
        const registries = await this.getRegistries()
        const filtered = registries.filter(r => r.name !== name)

        if (filtered.length === registries.length) {
            return false
        }
        await this.storage.setItem(this.STORAGE_KEY, filtered)
        return true
    }

    /**
     * Get a registry by URL
     */
    async getRegistry(name: string): Promise<PluginRegistry | undefined> {
        const registries = await this.getRegistries()
        return registries.find(r => r.name === name)
    }
}

// Export singleton instance
export const pluginRegistry = new PluginRegistryManager()
