<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <div class="flex flex-row gap-2">
                    {{ plugin.name }}
                    <Badge :variant="plugin.state.enabled ? 'default' : 'secondary'">
                        {{ plugin.state.enabled ? 'Enabled' : 'Disabled' }}
                    </Badge>
                </div>

                <Button variant="destructive" @click="$emit('remove', plugin.id)" :disabled="isLoading">
                    Remove <Trash2 class=" h-4 w-4" />
                </Button>
            </CardTitle>
            <p class="text-sm text-muted-foreground">Version {{ plugin.version }}</p>
            <CardDescription v-if="plugin.description">{{ plugin.description }}</CardDescription>
        </CardHeader>
        <CardContent>
            <div v-if="plugin.author" class="text-sm text-muted-foreground">
                <div v-if="typeof plugin.author === 'string'">
                    Author: {{ plugin.author }}
                </div>
                <div v-else>
                    Author:
                    <NuxtLink v-if="plugin.author.url" :to="plugin.author.url" target="_blank">
                        <Button size="sm" variant="link">
                            {{ plugin.author.name }}
                        </Button>
                    </NuxtLink>
                </div>
            </div>
            <div v-if="plugin.dependencies" class="text-sm text-muted-foreground">
                Dependencies:
                <div class="flex flex-row flex-wrap gap-2">
                    <Badge v-for="(version, dependency) in plugin.dependencies" :key="dependency" variant="secondary">
                        {{ dependency }}@{{ version }}
                    </Badge>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <div class="w-full flex space-x-2 justify-between">
                <Button variant="outline" @click="$emit('toggle', plugin.id, !plugin.state.enabled)"
                    :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    
                    {{ plugin.state.enabled ? 'Disable' : 'Enable' }}
                </Button>

            </div>
        </CardFooter>
    </Card>
</template>

<script setup lang="ts">
import type { Plugin } from '~~/types'
import { Loader2, Trash2 } from 'lucide-vue-next'
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