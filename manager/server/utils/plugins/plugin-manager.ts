import { cp, readFile, writeFile, mkdir, rmdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { NuxtConfig } from 'nuxt/config'
import type { PackageJson } from 'type-fest'

const basePath = '../base'
const baseNuxtConfigPath = `${basePath}/nuxt.config.ts`

export class PluginManager {
    async activatePlugin(id: string) {
        const state = await getPluginState(id)
        const baseNuxtConfig = JSON.parse(await readFile(baseNuxtConfigPath, 'utf-8')) as NuxtConfig

        console.log(`Ensuring plugin directory exists: ${basePath}/rtLayers/${state.id}`)
        await mkdir(`${basePath}/rtLayers/${state.id}`, { recursive: true })

        console.log(`Copying plugin files to ${basePath}/rtLayers/${state.id}`)
        await cp(state.path, `${basePath}/rtLayers/${state.id}`)

        const pluginPackageJsonPath = `${state.path}/package.json`

        const pluginHasPackageJson = existsSync(pluginPackageJsonPath)

        console.log(`Adding plugin to base nuxt config: ${baseNuxtConfigPath}`)
        if (Array.isArray(baseNuxtConfig.extends)) {
            baseNuxtConfig.extends.push([`rtLayers/${state.id}`, { install: pluginHasPackageJson }])
        } else {
            baseNuxtConfig.extends = [baseNuxtConfig.extends, [`rtLayers/${state.id}`, { install: pluginHasPackageJson }]]
        }
        await writeFile(baseNuxtConfigPath, JSON.stringify(baseNuxtConfig, null, 2))
    }
    async deactivatePlugin(id: string) {
        const state = await getPluginState(id)
        const baseNuxtConfig = JSON.parse(await readFile(baseNuxtConfigPath, 'utf-8')) as NuxtConfig

        console.log(`Removing plugin from base nuxt config: ${baseNuxtConfigPath}`)
        if (Array.isArray(baseNuxtConfig.extends)) {
            // filter plugin out of extends array
            baseNuxtConfig.extends = baseNuxtConfig.extends.filter((value) => {
                if (Array.isArray(value)) {
                    return value[0] !== `rtLayers/${state.id}`
                } else {
                    return true
                }
            }) as NuxtConfig['extends']
        } else {
            throw Error('Invalid base nuxt config extends')
        }

        await rmdir(`${basePath}/rtLayers/${state.id}`, { recursive: true })
        await writeFile(baseNuxtConfigPath, JSON.stringify(baseNuxtConfig, null, 2))
    }
}

export const pluginManager = new PluginManager()