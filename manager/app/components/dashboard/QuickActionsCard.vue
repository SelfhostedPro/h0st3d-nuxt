<template>
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Common management tasks</CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <Button variant="outline" class="w-full justify-start" @click="navigateToPlugins">
        <Settings class="mr-2 h-4 w-4" />
        Manage Plugins
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
const router = useRouter()

const navigateToPlugins = () => router.push('/plugins')
</script>
