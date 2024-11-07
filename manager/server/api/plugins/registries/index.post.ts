import { defineEventHandler, readBody, createError } from 'h3'
import { PluginRegistryManager } from '~~/server/utils/plugin-registry'
import { z } from 'zod'

const AddRegistrySchema = z.object({
  name: z.string().min(1),
  url: z.string().url()
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const registry = AddRegistrySchema.parse(body)

    const registryManager = new PluginRegistryManager()
    return await registryManager.addRegistry(registry)
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