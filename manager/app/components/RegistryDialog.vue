<template>
  <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Manage Plugin Registries</DialogTitle>
        <DialogDescription>
          Add or remove plugin registry sources
        </DialogDescription>
      </DialogHeader>
      
      <div class="grid gap-4 py-4">
        <div class="grid gap-4">
          <Card v-for="registry in registries" :key="registry.url">
            <CardHeader>
              <CardTitle class="flex items-center justify-between">
                {{ registry.name }}
                <Badge variant="default">
                  {{ registry.type }}
                </Badge>
              </CardTitle>
              <CardDescription>{{ registry.url }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive"
                size="sm"
                @click="removeRegistry(registry.name)"
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        </div>

        <div class="border-t pt-4">
          <h4 class="font-medium mb-4">Add New Registry</h4>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="name">Registry Name</Label>
              <Input 
                id="name" 
                v-model="newRegistry.name" 
                placeholder="My Registry"
              />
            </div>
            <div class="grid gap-2">
              <Label for="url">Registry URL</Label>
              <Input 
                id="url" 
                v-model="newRegistry.url" 
                placeholder="https://registry.example.com"
              />
            </div>
            <div class="grid gap-2">
              <Label for="type">Registry Type</Label>
              <select 
                id="type"
                v-model="newRegistry.type"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="bitbucket">Bitbucket</option>
              </select>
            </div>
            <Button 
              :disabled="!newRegistry.name || !newRegistry.url"
              @click="addRegistry"
            >
              Add Registry
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:modelValue', false)">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:open': [value: boolean]
}>()

const { 
  registries,
  addRegistry: addRegistryToStore,
  removeRegistry: removeRegistryFromStore,
} = usePluginManager()

const newRegistry = ref({
  name: '',
  url: '',
  type: 'github' as const
})

const addRegistry = async () => {
  try {
    await addRegistryToStore(newRegistry.value)
    newRegistry.value = { name: '', url: '', type: 'github' }
  } catch (error) {
    console.error('Failed to add registry:', error)
  }
}

const removeRegistry = async (name: string) => {
  try {
    await removeRegistryFromStore(name)
  } catch (error) {
    console.error('Failed to remove registry:', error)
  }
}
</script>
