import { defineEventHandler, createError } from 'h3'
import { pluginRegistry } from '~~/server/utils/plugins/plugin-registry'
import { ExternalPluginManifest, PluginManifest } from '~~/types'

export default defineEventHandler(async (event): Promise<{ [key: string]: ExternalPluginManifest[] }> => {
  try {
    const registry = getQuery(event).registry as string
    if (!registry) {
      return await pluginRegistry.getRegistryPlugins()
    } else {
      return await pluginRegistry.getRegistryPlugins(registry)
    }
  } catch (error) {
    console.error('Failed to get registry plugins:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get registry plugins'
    })
  }
})
