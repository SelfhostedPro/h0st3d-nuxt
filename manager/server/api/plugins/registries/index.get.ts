import { defineEventHandler } from 'h3'
import { PluginRegistryManager } from '~~/server/utils/plugin-registry'

export default defineEventHandler(async () => {
  const registryManager = new PluginRegistryManager()
  return await registryManager.getRegistries()
})  