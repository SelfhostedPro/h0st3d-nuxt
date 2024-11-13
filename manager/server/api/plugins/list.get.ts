import { defineEventHandler } from 'h3'
import { getPluginsState } from '~~/server/utils/plugins/plugin-state'

export default defineEventHandler(async () => {
  return await getPluginsState()
})
