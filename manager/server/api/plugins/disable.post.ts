import { PluginStateSchema } from "~~/types"
import { pluginManager } from "~~/server/utils/plugins/plugin-manager"

export default defineEventHandler(async (event) => {
    const nitro = useNitroApp()
    const body = await readValidatedBody(event, body => PluginStateSchema.safeParse(body))
    if (!body.success) {
        throw body.error.issues
    }
    const { id } = body.data
    await pluginManager.deactivatePlugin(id)
    await nitro.hooks.callHook('base:rebuild', `Disabling plugin: ${id}`)
})