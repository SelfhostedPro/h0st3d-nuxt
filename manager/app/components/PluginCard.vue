<template>
    <Card>
        <CardHeader>{{ registry }}</CardHeader>
        <CardContent>
            <div v-for="plugin in plugins" :key="plugin.name">
                <p>{{ plugin.name }}</p>
            </div>
        </CardContent>
    </Card>
</template>
<script setup lang="ts">
const [name, plugins] = defineProps<{
    registry: string,
    plugins: PluginManifest[]
}>();
</script>