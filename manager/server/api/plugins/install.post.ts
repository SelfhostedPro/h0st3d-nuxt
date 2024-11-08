import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { PluginDownloader } from '~~/server/utils/plugin-downloader'
import { getPluginState, savePluginState } from '~~/server/utils/plugin-state'
import { addPluginSchema } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, body => addPluginSchema.safeParse(body))
    if (!body.success) {
      throw body.error.issues
    }

    const { name, registry } = body.data

    const downloader = new PluginDownloader()
    const result = await downloader.download(name, registry, `${registry}/${name}`)

    const state = await getPluginState()
    state[result.plugin.name] = result.plugin
    await savePluginState(state)

    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`Validation error: ${error.errors}`)
      throw createError({
        statusCode: 400,
        message: 'Invalid request body',
        data: error.errors
      })
    }
    console.log(`Error: ${error}`)
    throw error
  }
})
