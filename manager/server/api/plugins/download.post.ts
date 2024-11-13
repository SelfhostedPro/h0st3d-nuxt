import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { pluginDownloader } from '~~/server/utils/plugins/plugin-downloader'
import { getPluginsState, savePluginState } from '~~/server/utils/plugins/plugin-state'
import { addPluginSchema } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, body => addPluginSchema.safeParse(body))
    if (!body.success) {
      throw body.error.issues
    }

    const { name, registry } = body.data

    const { source, dir } = await pluginDownloader.download(name, registry, `${registry}/${name}`)

    const state = await getPluginsState()



    state[`${registry}/${name}`] = {
      id: `${registry}/${name}`,
      path: dir,
      enabled: false,
      installedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      source,
      registry
    }

    return await savePluginState(state)
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
