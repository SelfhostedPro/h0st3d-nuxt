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
                <!-- Error Alert -->
                <ErrorAlert v-if="registryError" :message="registryError" @dismiss="store.clearErrors()" />

                <!-- Loading State -->
                <div v-if="isRegistryLoading" class="flex justify-center py-8">
                    <Loader2 class="h-8 w-8 animate-spin" />
                </div>

                <!-- Registry List -->
                <div v-else-if="registries.length > 0" class="grid gap-4">
                    <Card v-for="registry in registries" :key="registry.url">
                        <CardHeader>
                            <CardTitle class="flex items-center justify-between">
                                {{ registry.name }}
                                <!-- <Badge variant="default">
                                    {{ registry. }}
                                </Badge> -->
                            </CardTitle>
                            <CardDescription>{{ registry.url }}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="destructive" size="sm" @click="handleRemoveRegistry(registry.name)"
                                :disabled="isRegistryLoading">
                                <Trash2 class="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-4 text-muted-foreground">
                    No registries found. Add one below.
                </div>

                <!-- Add Registry Form -->
                <div class="border-t pt-4">
                    <h4 class="font-medium mb-4">Add New Registry</h4>
                    <form @submit.prevent="handleAddRegistry" class="grid gap-4">
                        <div class="grid gap-2">
                            <Label for="name">Registry Name</Label>
                            <Input id="name" v-model="newRegistry.name" placeholder="My Registry" required />
                        </div>
                        <div class="grid gap-2">
                            <Label for="url">Registry URL</Label>
                            <Input id="url" v-model="newRegistry.url" placeholder="https://registry.example.com"
                                required />
                        </div>
                        <div class="grid gap-2">
                            <Label for="type">Registry Type</Label>
                            <Select v-model="newRegistry.type">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select registry type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="github">GitHub</SelectItem>
                                    <SelectItem value="gitlab">GitLab</SelectItem>
                                    <SelectItem value="bitbucket">Bitbucket</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" :disabled="isRegistryLoading || !newRegistry.name || !newRegistry.url">
                            <Plus class="h-4 w-4 mr-2" />
                            Add Registry
                        </Button>
                    </form>
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
import { Plus, Trash2, Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

defineProps<{
    modelValue: boolean
}>()

defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const store = usePluginStore()
const { registries, isRegistryLoading, registryError } = storeToRefs(store)

const newRegistry = ref({
    name: '',
    url: '',
    type: 'github' as const
})

const handleAddRegistry = async () => {
    try {
        await store.addRegistry(newRegistry.value)
        newRegistry.value = { name: '', url: '', type: 'github' }
    } catch (error) {
        // Error is handled by store
    }
}

const handleRemoveRegistry = async (name: string) => {
    try {
        await store.removeRegistry(name)
    } catch (error) {
        // Error is handled by store
    }
}

// Initialize registries when dialog opens
onMounted(() => {
    store.getRegistries()
})
</script>