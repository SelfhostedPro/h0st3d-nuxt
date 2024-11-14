<template>
    <Alert variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ message }}</AlertDescription>
        <Button variant="ghost" size="icon" class="absolute right-2 top-2" @click="$emit('dismiss')">
            <X class="h-4 w-4" />
        </Button>
    </Alert>
</template>

<script setup lang="ts">
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { X, AlertCircle } from 'lucide-vue-next'
defineProps<{
    message: string
}>()
</script>