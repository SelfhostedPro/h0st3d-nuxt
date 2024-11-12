<template>
    <Card>
      <CardContent class="p-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">{{ label }}</span>
          <Badge :variant="variant">{{ value }}</Badge>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    label: string
    value: string | number
    variant?: 'default' | 'secondary'
  }>()
  </script>
  