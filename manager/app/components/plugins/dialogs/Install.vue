<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Install Plugin</DialogTitle>
                <DialogDescription>
                    Select a plugin from available registries
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div v-if="isRegistryLoading" class="text-center py-4">
                    <Loader2 class="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    <p class="mt-2 text-sm text-muted-foreground">Loading available plugins...</p>
                </div>
                <div v-else-if="!registryPlugins || Object.keys(registryPlugins).length === 0" class="text-center py-4">
                    <PackageX class="w-12 h-12 mx-auto text-muted-foreground" />
                    <p class="mt-2 text-sm text-muted-foreground">No registry plugins found. Check your registries.</p>
                </div>
                <div v-else>
                    <Label for="plugin">Select Plugin</Label>
                    <PluginsRegistryCard :registries="registryPlugins" :selected-plugin="selectedPlugin"
                        @select="$emit('update:selectedPlugin', $event)" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" @click="$emit('update:open', false)">
                    Cancel
                </Button>
                <Button :disabled="!selectedPlugin || isLoading" @click="$emit('install')">
                    {{ isLoading ? 'Installing...' : 'Install' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Loader2, PackageX } from 'lucide-vue-next'
import type { AddPlugin, PluginManifest } from '~~/types'
import { storeToRefs } from 'pinia'

const store = usePluginStore()
const { isRegistryLoading, registryPlugins, isLoading } = storeToRefs(store)

defineProps<{
    open: boolean
    selectedPlugin: AddPlugin | null
}>()

defineEmits<{
    'update:open': [value: boolean]
    'update:selectedPlugin': [AddPlugin | null]
    install: []
}>()

onMounted(() => {
    store.getRegistryPlugins()
})
</script>