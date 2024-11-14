import { defineEventHandler } from 'h3'
import { pluginManager, PluginManager } from '~~/server/utils/plugins/plugin-manager'

export default defineEventHandler(async () => {
  const plugins = await pluginManager.getPlugins()
  return plugins
})
