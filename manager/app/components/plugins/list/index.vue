<template>
    <div class="grid gap-4">
        <div v-if="isLoading" class="flex justify-center py-8">
            <Loader2 class="h-8 w-8 animate-spin" />
        </div>
        <div v-else-if="plugins.length === 0" class="text-center py-8 text-muted-foreground">
            No plugins installed
        </div>
        <template v-else>
            <PluginsListItem v-for="plugin in plugins" :key="plugin.name" :plugin="plugin"
                @toggle="(id, enabled) => $emit('toggle', id, enabled)" @remove="$emit('remove', $event)" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import type { Plugin } from '~~/types'

defineProps<{
    plugins: Plugin[]
    isLoading?: boolean
}>()

defineEmits<{
    toggle: [id: string, enabled: boolean]
    remove: [id: string]
}>()
</script>