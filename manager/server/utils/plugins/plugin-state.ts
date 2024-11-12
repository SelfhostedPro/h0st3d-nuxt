import { useStorage } from '#imports'
import type { Plugin } from '~~/types'

const PLUGINS_STORAGE_KEY = 'plugins:installed.json'

export const getPluginState = async (): Promise<Record<string, Plugin>> => {
  const storage = useStorage()
  const state = await storage.getItem<Record<string, Plugin>>(PLUGINS_STORAGE_KEY) || {}
  return state
}

export const savePluginState = async (state: Record<string, Plugin>) => {
  const storage = useStorage()
  await storage.setItem(PLUGINS_STORAGE_KEY, state)
}
