import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { PluginDownloader } from '~~/server/utils/plugin-downloader'
import { getPluginState, savePluginState } from '~~/server/utils/plugin-state'
import { addPluginSchema } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, addPluginSchema.parse)

    const downloader = new PluginDownloader()
    const result = await downloader.download(body.name, body.registry, `${body.registry}/${body.name}`)

    const state = await getPluginState()
    state[result.plugin.name] = result.plugin
    await savePluginState(state)

    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body',
        data: error.errors
      })
    }
    throw error
  }
})
