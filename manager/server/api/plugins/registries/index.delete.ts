import { defineEventHandler, getQuery, createError } from 'h3'
import { PluginRegistryManager } from '~~/server/utils/plugins/plugin-registry'
import { z } from 'zod'

const DeleteRegistrySchema = z.object({
  name: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { name } = DeleteRegistrySchema.parse(query)

    const registryManager = new PluginRegistryManager()
    await registryManager.removeRegistry(name)
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