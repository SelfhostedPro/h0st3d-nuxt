<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                {{ plugin.name }}
                <Badge :variant="plugin.state.enabled ? 'default' : 'secondary'">
                    {{ plugin.state.enabled ? 'Enabled' : 'Disabled' }}
                </Badge>
            </CardTitle>
            <CardDescription>{{ plugin.description }}</CardDescription>
        </CardHeader>
        <CardContent>
            <p class="text-sm text-muted-foreground mb-4">Version {{ plugin.version }}</p>
            <div class="space-x-2">
                <Button variant="outline" @click="$emit('toggle', plugin.id, !plugin.state.enabled)"
                    :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ plugin.state.enabled ? 'Disable' : 'Enable' }}
                </Button>
                <Button variant="destructive" @click="$emit('remove', plugin.id)" :disabled="isLoading">
                    Remove
                </Button>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import type { Plugin } from '~~/types'
import { Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = usePluginStore()
const { isLoading } = storeToRefs(store)

defineProps<{
    plugin: Plugin
}>()

defineEmits<{
    toggle: [id: string, enabled: boolean]
    remove: [id: string]
}>()
</script>