<template>
    <div class="space-y-1">
        <div class="flex items-center justify-between">
            <Label>{{ label }}</Label>
            <span class="text-sm text-muted-foreground">
                {{ format(used) }} / {{ format(total) }}
            </span>
        </div>
        <Progress class="w-full" v-bind:model-value="percentage" />
        <p class="text-xs text-muted-foreground">
            {{ percentage.toFixed(1) }}% used
            <template v-if="available && formatAvailable">
                ({{ formatAvailable(available) }} available)
            </template>
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    used: number
    total: number
    percentage: number
    format: (value: number) => string
    available?: number
    formatAvailable?: (value: number) => string
}>()
</script>