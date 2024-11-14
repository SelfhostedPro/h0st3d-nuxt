<template>
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div v-if="isLoading" class="flex justify-center py-8 col-span-full">
            <Loader2 class="h-8 w-8 animate-spin" />
        </div>
        <div v-else-if="Object.entries(plugins).length === 0" class="text-center py-8 text-muted-foreground col-span-full">
            No plugins installed
        </div>
        <template v-else>
            <PluginsListItem 
                v-for="([id, plugin]) in Object.entries(plugins)" 
                :key="id" 
                :plugin="plugin"
                @toggle="(id, enabled) => $emit('toggle', id, enabled)" 
                @remove="$emit('remove', $event)" 
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import type { Plugin } from '~~/types'

defineProps<{
    plugins: Record<string, Plugin>
    isLoading?: boolean
}>()

defineEmits<{
    toggle: [id: string, enabled: boolean]
    remove: [id: string]
}>()
</script>