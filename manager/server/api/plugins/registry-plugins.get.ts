import { defineEventHandler, createError } from 'h3'
import { PluginRegistryManager, pluginRegistry } from '~~/server/utils/plugin-registry'
import { z } from 'zod'
import { PluginManifest, PluginManifestSchema } from '~~/types'

export default defineEventHandler(async (event): Promise<{ [key: string]: PluginManifest[] }> => {
  try {
    const registry = getQuery(event).registry as string
    if (!registry) {
      return await pluginRegistry.getRegistryPlugins()
    } else {
      return await pluginRegistry.getRegistryPlugins()
    }
  } catch (error) {
    console.error('Failed to get registry plugins:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get registry plugins'
    })
  }
})
