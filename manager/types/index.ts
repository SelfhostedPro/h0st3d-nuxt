import { z } from 'zod'

const PluginRegistrySchema = z.object({
    name: z.string(),
    url: z.string(),
    auth: z.string().optional()
})

const GetPluginRegistrySchema = PluginRegistrySchema.extend({
    auth: z.boolean().optional()
})

type PluginRegistry = z.infer<typeof PluginRegistrySchema>
type GetPluginRegistry = z.infer<typeof GetPluginRegistrySchema>

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

type addPlugin = z.infer<typeof addPluginSchema>
type GetPlugin = z.infer<typeof getPluginSchema>


export const PluginManifestSchema = z.object({
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
    provider: z.string().optional(), // ID of the provider
    repository: z.string().optional() // Repository path/URL
})

export const PluginStateSchema = z.object({
    enabled: z.boolean(),
    installedAt: z.string(),
    lastUpdated: z.string(),
    provider: z.string() // ID of the provider used
})

export type PluginManifest = z.infer<typeof PluginManifestSchema>
export type PluginState = z.infer<typeof PluginStateSchema>

export interface Plugin extends PluginManifest {
    id: string
    state: PluginState
}

export { PluginRegistrySchema, GetPluginRegistrySchema, addPluginSchema, getPluginSchema, type PluginRegistry, type GetPluginRegistry, type addPlugin, type GetPlugin }