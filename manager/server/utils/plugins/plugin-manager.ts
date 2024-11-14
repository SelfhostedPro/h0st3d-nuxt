import { cp, mkdir, rmdir } from 'node:fs/promises'
import { updateConfig } from 'c12/update'
import { loadConfig, } from 'c12'
import { existsSync } from 'node:fs'
import { NuxtConfig } from 'nuxt/config'
import type { PackageJson } from 'type-fest'
import type { Plugin } from '~~/types'
import { runCommand } from 'nuxi'

const basePath = '../base'
const baseNuxtConfigPath = `${basePath}/nuxt.config.ts`

const PLUGINS_DIR = 'downloaded'

export class PluginManager {
    async getPlugins(): Promise<Record<string, Plugin>> {
        const state = await getPluginsState()
        const storage = useStorage('data')
        const plugins = {} as Record<string, Plugin>

        for (const [id, pluginState] of Object.entries(state)) {
            const plugin = await storage.getItem<PackageJson>(`${PLUGINS_DIR}/${id}/package.json`)
            if (plugin) {
                const name = id.split('/')[1]
                plugins[id] = {
                    id,
                    name,
                    state: pluginState,
                    version: plugin.version || 'main',
                    description: plugin.description,
                    author: plugin.author,
                    dependencies: {
                        ...plugin.dependencies,
                        ...plugin.devDependencies
                    }
                }
            }
        }
        return plugins
    }
    async activatePlugin(id: string) {
        const state = await getPluginState(id)
        // const { config } = await loadConfig<NuxtConfig>({ configFile: 'nuxt.config', cwd: basePath })
        // const baseNuxtConfig = await readFile(baseNuxtConfigPath, 'utf-8') as NuxtConfig
        // console.log(config)

        console.log(`Ensuring plugin directory exists: ${basePath}/rtLayers/${state.id}`)
        await mkdir(`${basePath}/rtLayers/${state.id}`, { recursive: true })

        console.log(`Copying plugin files to ${basePath}/rtLayers/${state.id}`)
        await cp(state.path, `${basePath}/rtLayers/${state.id}`, { force: true, recursive: true, errorOnExist: false })
        runCommand('prepare', [`--cwd`, basePath])

        const pluginPackageJsonPath = `${state.path}/package.json`

        const pluginHasPackageJson = existsSync(pluginPackageJsonPath)

        console.log(`Adding plugin to base nuxt config: ${baseNuxtConfigPath}`)

        await updateConfig({
            configFile: 'nuxt.config', cwd: basePath,
            async onUpdate(config: NuxtConfig) {
                if (Array.isArray(config.extends)) {
                    config.extends.push([`rtLayers/${state.id}`, { install: pluginHasPackageJson }])
                } else {
                    config.extends = [config.extends, [`rtLayers/${state.id}`, { install: pluginHasPackageJson }]]
                }
            },
        })
    }
    async deactivatePlugin(id: string) {
        const state = await getPluginState(id)
        console.log(`Removing plugin from base nuxt config: ${baseNuxtConfigPath} `)

        await rmdir(`${basePath} /rtLayers/${state.id} `, { recursive: true })
        await updateConfig({
            configFile: 'nuxt.config', cwd: basePath,
            async onUpdate(config: NuxtConfig) {
                if (Array.isArray(config.extends)) {
                    // filter plugin out of extends array
                    config.extends = config.extends.filter((value) => {
                        if (Array.isArray(value)) {
                            return value[0] !== `rtLayers / ${state.id} `
                        } else {
                            return true
                        }
                    }) as NuxtConfig['extends']
                } else {
                    throw Error('Invalid base nuxt config extends')
                }
            },
        })
    }
}

export const pluginManager = new PluginManager()