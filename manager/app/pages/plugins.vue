<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Plugin Manager
      </h1>
      <div class="space-x-4">
        <Button @click="showRegistryDialog = true">
          <ServerIcon class="mr-2 h-4 w-4" />
          Manage Registries
        </Button>
        <Button @click="showInstallDialog = true">
          <Plus class="mr-2 h-4 w-4" />
          Install Plugin
        </Button>
      </div>

      <!-- Registry Dialog -->
      <RegistryDialog v-model="showRegistryDialog" />
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>
    
    <div class="grid gap-4">
      <Card v-for="plugin in installedPlugins" :key="plugin.name">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            {{ plugin.name }}
            <Badge :variant="plugin.state.enabled ? 'default' : 'secondary'">
              {{ plugin.state.enabled ? 'Enabled' : 'Disabled' }}
            </Badge>
          </CardTitle>
          <CardDescription>{{ plugin.description }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">Version {{ plugin.version }}</p>
          <div class="space-x-2">
            <Button 
              variant="outline" 
              @click="togglePlugin(plugin.id, !plugin.state.enabled)"
            >
              {{ plugin.state.enabled ? 'Disable' : 'Enable' }}
            </Button>
            <Button 
              variant="destructive"
              @click="removePlugin(plugin.id)"
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Install Dialog -->
    <Dialog v-model:open="showInstallDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Plugin</DialogTitle>
          <DialogDescription>
            Select a plugin from available registries
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div v-if="isLoadingPlugins" class="text-center py-4">
            Loading available plugins...
          </div>
          <div v-else-if="registryPlugins.length === 0" class="text-center py-4">
            No plugins found in registries. Add a registry first.
          </div>
          <div v-else class="grid gap-4">
            <div class="grid gap-2">
              <Label for="plugin">Select Plugin</Label>
              <select
                id="plugin"
                v-model="selectedPlugin"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option :value="null">Select a plugin...</option>
                <option
                  v-for="plugin in registryPlugins"
                  :key="plugin.name"
                  :value="plugin"
                >
                  {{ plugin.name }} ({{ plugin.registry }})
                </option>
              </select>
            </div>
            
            <div v-if="selectedPlugin" class="space-y-2">
              <h4 class="font-medium">Plugin Details</h4>
              <div class="text-sm space-y-1">
                <p><span class="text-muted-foreground">Name:</span> {{ selectedPlugin.name }}</p>
                <p><span class="text-muted-foreground">Version:</span> {{ selectedPlugin.version }}</p>
                <p><span class="text-muted-foreground">Description:</span> {{ selectedPlugin.description }}</p>
                <p><span class="text-muted-foreground">Author:</span> {{ selectedPlugin.author }}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showInstallDialog = false">
            Cancel
          </Button>
          <Button 
            :disabled="isLoading" 
            @click="installPlugin"
          >
            {{ isLoading ? 'Installing...' : 'Install' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Server as ServerIcon } from 'lucide-vue-next'

const { 
  installedPlugins, 
  isLoading, 
  error: pluginError,
  installPlugin: install,
  togglePlugin,
  removePlugin
} = usePluginManager()

// Sync pluginError with local error
watch(pluginError, (newError) => {
  if (newError) {
    error.value = newError
  }
})

const showRegistryDialog = ref(false)
const showInstallDialog = ref(false)
const registryPlugins = ref([])
const selectedPlugin = ref(null)
const isLoadingPlugins = ref(false)
const error = ref<string | null>(null)

const fetchRegistryPlugins = async () => {
  try {
    isLoadingPlugins.value = true
    const response = await $fetch('/api/plugins/registry-plugins')
    registryPlugins.value = response
  } catch (error) {
    console.error('Failed to fetch registry plugins:', error)
    error.value = 'Failed to fetch available plugins'
  } finally {
    isLoadingPlugins.value = false
  }
}

const installPlugin = async () => {
  if (!selectedPlugin.value) return
  
  try {
    await install({
      name: selectedPlugin.value.name,
      provider: selectedPlugin.value.provider || 'github'
    })
    selectedPlugin.value = null
    showInstallDialog.value = false
  } catch (error: any) {
    console.error('Failed to install plugin:', error)
    // Use the error from usePluginManager instead of alert
    if (!error.message) {
      error.value = 'Failed to install plugin. Check console for details.'
    }
  }
}

const handleError = (message: string) => {
  error.value = message
  setTimeout(() => {
    error.value = null
  }, 5000)
}

// Fetch plugins when dialog opens
watch(showInstallDialog, async (isOpen) => {
  if (isOpen) {
    await fetchRegistryPlugins()
  }
})
</script>
