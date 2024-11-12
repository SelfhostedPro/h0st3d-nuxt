<template>
    <div class="mt-4 grid grid-cols-2 gap-2">
        <SystemInfoItem label="PID" :value="pid" />
        <SystemInfoItem label="Platform" :value="platform" />
        <SystemInfoItem label="Node" :value="nodeVersion" />
        <SystemInfoItem label="Plugins" :value="activePlugins" :variant="'default'" />
    </div>
</template>

<script setup lang="ts">
import SystemInfoItem from './SystemInfoItem.vue';

defineProps<{
    pid: number
    platform: string
    nodeVersion: string
    activePlugins: number
}>()
</script>