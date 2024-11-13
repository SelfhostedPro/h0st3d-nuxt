import { z } from 'zod'

const PluginRegistrySchema = z.object({
    name: z.string(),
    url: z.string(),
    auth: z.string().optional()
})
type PluginRegistry = z.infer<typeof PluginRegistrySchema>

export { PluginRegistrySchema, type PluginRegistry }

const addPluginSchema = z.object({
    name: z.string(),
    registry: z.string(),
})

const getPluginSchema = addPluginSchema.extend({
    id: z.string(),
    path: z.string(),
    version: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    description: z.string().optional()
})

type AddPlugin = z.infer<typeof addPluginSchema>
type GetPlugin = z.infer<typeof getPluginSchema>

export { addPluginSchema, getPluginSchema, type AddPlugin, type GetPlugin }

const PluginManifestSchema = z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    description: z.string(),
    author: z.string(),
    entry: z.string(),
    dependencies: z.record(z.string()),
    components: z.array(z.string()).optional(),
    routes: z.array(
        z.object({
            path: z.string(),
            component: z.string()
        })
    ).optional(),
})

const PluginStateSchema = z.object({
    id: z.string(),
    path: z.string(),
    enabled: z.boolean(),
    installedAt: z.string(),
    lastUpdated: z.string(),
    source: z.string(),
    registry: z.string() // ID of the provider used
})

type PluginManifest = z.infer<typeof PluginManifestSchema>
type PluginState = z.infer<typeof PluginStateSchema>
export { PluginManifestSchema, PluginStateSchema, type PluginManifest, type PluginState }

interface Plugin extends PluginManifest {
    id: string
    state: PluginState
}

export { type Plugin }