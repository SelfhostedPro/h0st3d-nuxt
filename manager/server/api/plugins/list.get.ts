import { defineEventHandler } from 'h3'
import { getPluginState } from '~~/server/utils/plugin-state'

export default defineEventHandler(async () => {
  return await getPluginState()
})
