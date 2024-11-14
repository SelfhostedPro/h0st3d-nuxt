import { PluginStateSchema } from "~~/types"
import { z } from 'zod'
import { pluginManager } from "~~/server/utils/plugins/plugin-manager"

export default defineEventHandler(async (event) => {
    const nitro = useNitroApp()

    const body = await readValidatedBody(event, body => z.object({ id: z.string() }).safeParse(body))
    if (!body.success) {
        console.error('Failed to enable plugin:', body.error.issues)
        throw body.error.issues
    }
    const { id } = body.data
    await pluginManager.activatePlugin(id)
    await nitro.hooks.callHook('base:rebuild', `Enabling plugin: ${id}`)
})