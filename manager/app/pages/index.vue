<template>
  <div class="p-8">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
      Dashboard
    </h1>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system metrics and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Uptime</span>
              <span>{{ uptime }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Active Plugins</span>
              <span>{{ activePlugins }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = usePluginStore()
const { installedPlugins } = storeToRefs(store)

const activePlugins = computed(() =>
  installedPlugins.value.filter(p => p.state.enabled).length
)

const uptime = ref('0:00:00')

onMounted(() => {
  store.refreshPlugins()

  const start = new Date()
  setInterval(() => {
    const diff = new Date(new Date().getTime() - start.getTime())
    const hours = diff.getUTCHours()
    const minutes = diff.getUTCMinutes()
    const seconds = diff.getUTCSeconds()
    uptime.value = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
})

const navigateToPlugins = () => router.push('/plugins')
</script>
