import { defineEventHandler } from 'h3'
import { getPluginState } from '~~/server/utils/plugins/plugin-state'

export default defineEventHandler(async () => {
  return await getPluginState()
})
