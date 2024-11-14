import { useStorage } from '#imports'
import type { Plugin, PluginState } from '~~/types'


const PLUGINS_STORAGE_KEY = 'plugins:installed.json'

export const getPluginsState = async (): Promise<Record<string, PluginState>> => {
  const storage = useStorage('data')
  const state = await storage.getItem<Record<string, PluginState>>(PLUGINS_STORAGE_KEY) || {}
  return state
}

export const getPluginState = async (id: string): Promise<PluginState> => {
  const state = await getPluginsState()

  return state[id]
}

export const savePluginState = async (state: Record<string, PluginState>) => {
  const storage = useStorage('data')
  await storage.setItem(PLUGINS_STORAGE_KEY, state)
  console.log('state saved to storage', state)
  return getPluginsState()
}