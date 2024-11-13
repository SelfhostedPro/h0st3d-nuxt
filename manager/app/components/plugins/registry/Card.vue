<template>
    <div>
        <div v-if="Object.keys(registries).length === 0" class="text-center py-8">
            <Database class="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 class="mt-4 text-lg font-medium">No Registries Available</h3>
            <p class="text-sm text-muted-foreground mt-2">
                Add a registry to see available plugins
            </p>
        </div>
        <Tabs v-else :default-value="Object.keys(registries)[0]" class="w-full">
            <TabsList class="w-full grid" :class="`grid-cols-${Object.keys(registries).length}`">
                <TabsTrigger v-for="registry in Object.keys(registries)" :key="registry" :value="registry">
                    <div class="flex items-center gap-2">
                        <Database class="w-4 h-4" />
                        {{ registry }}
                        <Badge variant="secondary">
                            {{ (registries[registry] || []).length }}
                        </Badge>
                    </div>
                </TabsTrigger>
            </TabsList>

            <TabsContent v-for="(plugins, registry) of registries" :key="registry" :value="registry">
                <ScrollArea class="h-[60vh]">
                    <div class="space-y-2 pr-4">
                        <div v-for="plugin in plugins" :key="plugin.name" @click="handleSelect(registry, plugin)">
                            <Card :class="[
                                'cursor-pointer transition-colors',
                                selectedPlugin?.name === plugin.name
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-muted/50'
                            ]">
                                <CardHeader>
                                    <CardTitle>{{ plugin.name }}
                                    </CardTitle>
                                    <CardDescription>{{ plugin.description }}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p class="text-sm text-muted-foreground">Version: {{ plugin.version }}</p>
                                    <p v-if="plugin.description" class="text-sm"> {{ plugin.description }}</p>
                                    <p v-if="plugin.author" class="text-sm text-muted-foreground">
                                        Author: {{ plugin.author }}
                                    </p>
                                    <div v-if="plugin.dependencies" class="text-sm text-muted-foreground">
                                        Dependencies:
                                        <div class="flex flex-row flex-wrap gap-2">
                                            <Badge v-for="(version, dependency) in plugin.dependencies"
                                                :key="dependency" variant="secondary">
                                                {{ dependency }}@{{ version }}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div v-if="plugins.length === 0" class="py-8">
                        <div class="text-center space-y-3">
                            <PackageX class="w-12 h-12 mx-auto text-muted-foreground" />
                            <h3 class="text-lg font-medium">No plugins found</h3>
                            <p class="text-sm text-muted-foreground">
                                This registry doesn't have any plugins available.
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import type { AddPlugin, ExternalPluginManifest, PluginManifest } from '~~/types'
import { Card } from '~/components/ui/card'
import { Database, PackageX } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = usePluginStore()
const { isRegistryLoading } = storeToRefs(store)

const props = defineProps<{
    registries: Record<string, ExternalPluginManifest[]>,
    selectedPlugin?: AddPlugin | null
}>()

const emit = defineEmits<{
    select: [AddPlugin | null]
}>()

const handleSelect = (registry: string, plugin: ExternalPluginManifest) => {
    if (props.selectedPlugin?.name === plugin.name && props.selectedPlugin?.registry === registry) {
        emit('select', null)
    } else {
        emit('select', { registry: registry, name: plugin.name })
    }
}
</script>