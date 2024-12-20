import { downloadTemplate, DownloadTemplateResult } from 'giget'
import { pluginRegistry } from './plugin-registry'
import { env } from 'node:process'

/**
 * Handles downloading plugins from git providers using giget
 */
export class PluginDownloader {
  /**
   * Download a plugin from a git URL
   */
  async download(pluginName: string, registryName: string, targetDir: string): Promise<DownloadTemplateResult> {
    try {
      const registry = await pluginRegistry.getRegistry(registryName)
      const storagePath = `${env.DATA_DIR || '../data'}/manager`

      if (!registry) {
        throw new Error(`Registry ${registryName} not found`)
      }

      // Download using giget
      const result = await downloadTemplate(pluginName, {
        dir: `${storagePath}/downloaded/${targetDir}`,
        registry: registry.url.endsWith('/') ? registry.url.slice(0, -1) : registry.url,
        auth: registry.auth,
        install: false,
        forceClean: true
      })

      return result
    } catch (error) {
      console.error('Failed to download plugin:', error)
      throw new Error(`Failed to download plugin: ${(error as Error).message}`)
    }
  }
}

// Export singleton instance
export const pluginDownloader = new PluginDownloader()
