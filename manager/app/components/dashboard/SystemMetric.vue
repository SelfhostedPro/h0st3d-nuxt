<template>
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <Label>{{ label }}</Label>
        <span class="text-sm text-muted-foreground">{{ value }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    label: string
    value: string
  }>()
  </script>
  