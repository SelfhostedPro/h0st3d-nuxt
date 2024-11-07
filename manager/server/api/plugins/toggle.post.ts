import { defineEventHandler, readBody, createError } from 'h3'
import { getPluginState, savePluginState } from '~~/server/utils/plugin-state'
import { z } from 'zod'

const TogglePluginSchema = z.object({
  name: z.string().min(1),
  enabled: z.boolean()
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, enabled } = TogglePluginSchema.parse(body)

    const state = await getPluginState()
    if (!state[name]) {
      throw createError({
        statusCode: 404,
        message: `Plugin ${name} not found`
      })
    }

    state[name].state.enabled = enabled
    await savePluginState(state)

    return state[name]
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
