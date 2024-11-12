import { defineEventHandler, readBody, createError } from 'h3'
import { pluginRegistry } from '~~/server/utils/plugins/plugin-registry'
import { z } from 'zod'

const AddRegistrySchema = z.object({
  name: z.string().min(1),
  url: z.string().url()
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, AddRegistrySchema.parse)
    console.log('Validated Registry Structure', body)
    return await pluginRegistry.addRegistry(body)
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