import { defineEventHandler } from 'h3'
import { pluginRegistry } from '~~/server/utils/plugin-registry'

export default defineEventHandler(async () => {
  return await pluginRegistry.getRegistries()
})  