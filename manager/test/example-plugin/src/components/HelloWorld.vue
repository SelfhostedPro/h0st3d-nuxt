<template>
  <div class="p-4 bg-card border rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Hello from Plugin!</h2>
    <p class="text-muted-foreground">
      This component is provided by the example plugin.
      Counter: {{ count }}
    </p>
    <Button class="mt-4" @click="count++">
      Increment
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
