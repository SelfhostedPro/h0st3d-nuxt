<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Plugin Manager
            </h1>
            <div class="space-x-4">
                <Button @click="showRegistryDialog = true">
                    <ServerIcon class="mr-2 h-4 w-4" />
                    Manage Registries
                </Button>
                <Button @click="showInstallDialog = true">
                    <Plus class="mr-2 h-4 w-4" />
                    Install Plugin
                </Button>
            </div>
        </div>

        <ErrorAlert v-if="error" :message="error" class="mb-4" @dismiss="store.clearErrors()" />

        <plugins-list :plugins="installedPlugins" :is-loading="isLoading" @toggle="handleToggle"
            @remove="handleRemove" />

        <plugins-dialogs-install v-model:open="showInstallDialog" v-model:selected-plugin="selectedPlugin"
            :registries="registryPlugins" :is-loading="isRegistryLoading" :installing="isLoading"
            @install="handleInstall()" />

        <plugins-dialogs-registry v-model="showRegistryDialog" />
    </div>
</template>

<script setup lang="ts">
import { Plus, Server as ServerIcon } from 'lucide-vue-next'
import type { AddPlugin, PluginManifest } from '~~/types'
import { storeToRefs } from 'pinia'

const store = usePluginStore()
const {
    installedPlugins,
    registryPlugins,
    isLoading,
    isRegistryLoading,
    error,
} = storeToRefs(store)

const showInstallDialog = ref(false)
const showRegistryDialog = ref(false)
const selectedPlugin = ref<AddPlugin | null>(null)

// Initialize data
onMounted(() => {
    store.refreshPlugins()
    store.getRegistryPlugins()
})

const handleToggle = async (name: string, enabled: boolean) => {
    try {
        await store.togglePlugin(name, enabled)
    } catch (err) {
        // Error is handled by store
    }
}

const handleRemove = async (name: string) => {
    try {
        await store.removePlugin(name)
    } catch (err) {
        // Error is handled by store
    }
}

const handleInstall = async () => {
    console.log('selectedPlugin', selectedPlugin.value)
    if (!selectedPlugin.value) return

    try {
        await store.installPlugin({
            name: selectedPlugin.value.name,
            registry: selectedPlugin.value.registry
        })
        showInstallDialog.value = false
        selectedPlugin.value = null
    } catch (err) {
        // Error is handled by store
    }
}
</script>