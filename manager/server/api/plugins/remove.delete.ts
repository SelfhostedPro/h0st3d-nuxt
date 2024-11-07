import { defineEventHandler, getQuery, createError } from 'h3'
import { getPluginState, savePluginState } from '~~/server/utils/plugin-state'
import { z } from 'zod'

const RemovePluginSchema = z.object({
  name: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { name } = RemovePluginSchema.parse(query)

    const state = await getPluginState()
    if (!state[name]) {
      throw createError({
        statusCode: 404,
        message: `Plugin ${name} not found`
      })
    }

    delete state[name]
    await savePluginState(state)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid query parameters',
        data: error.errors
      })
    }
    throw error
  }
})         