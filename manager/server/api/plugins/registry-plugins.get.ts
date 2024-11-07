import { defineEventHandler, createError } from 'h3'
import { PluginRegistryManager } from '~~/server/utils/plugin-registry'
import { z } from 'zod'
import { PluginManifestSchema } from '~~/types'

export default defineEventHandler(async () => {
  try {
    const registryManager = new PluginRegistryManager()
    const registries = await registryManager.getRegistries()

    // Get plugins from all registries
    const allPlugins = []
    for (const registry of registries) {
      try {
        const plugins = await registryManager.getRegistryPlugins(registry.name)
        // Validate plugin data
        const validatedPlugins = plugins.map(plugin => {
          try {
            PluginManifestSchema.parse(plugin)
            return {
              ...plugin,
              registry: registry.name
            }
          } catch (err) {
            console.error(`Invalid plugin data from registry ${registry.name}:`, err)
            return null
          }
        }).filter(Boolean)

        allPlugins.push(...validatedPlugins)
      } catch (err) {
        console.error(`Failed to get plugins from registry ${registry.name}:`, err)
      }
    }

    return allPlugins
  } catch (error) {
    console.error('Failed to get registry plugins:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get registry plugins'
    })
  }
})
