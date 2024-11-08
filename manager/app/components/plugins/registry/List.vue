<template>
    <div class="grid gap-4">
        <Card v-for="registry in registries" :key="registry.url">
            <CardHeader>
                <CardTitle class="flex items-center justify-between">
                    {{ registry.name }}
                    <Badge variant="default">
                        <!-- {{ registry.type }} -->
                    </Badge>
                </CardTitle>
                <CardDescription>{{ registry.url }}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="destructive" size="sm" @click="handleRemove(registry.name)">
                    <Trash2 class="h-4 w-4 mr-2" />
                    Remove
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Add Registry</CardTitle>
                <CardDescription>Add a new plugin registry source</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleAdd">
                    <div class="grid gap-4">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="newRegistry.name" placeholder="Registry name" required />
                        </div>
                        <div class="grid gap-2">
                            <Label for="url">URL</Label>
                            <Input id="url" v-model="newRegistry.url" placeholder="Registry URL" required />
                        </div>
                        <div class="grid gap-2">
                            <Label for="type">Type</Label>
                            <Select id="type" v-model="newRegistry.type" required>
                                <option value="github">GitHub</option>
                                <option value="gitlab">GitLab</option>
                                <option value="custom">Custom</option>
                            </Select>
                        </div>
                        <Button type="submit" :disabled="isRegistryLoading">
                            <Plus class="mr-2 h-4 w-4" />
                            Add Registry
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Plus, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = usePluginStore()
const { registries, isRegistryLoading } = storeToRefs(store)

const newRegistry = ref({
    name: '',
    url: '',
    type: 'github' as const
})

const handleAdd = async () => {
    try {
        await store.addRegistry(newRegistry.value)
        newRegistry.value = {
            name: '',
            url: '',
            type: 'github'
        }
    } catch (err) {
        // Error is handled by store
    }
}

const handleRemove = async (name: string) => {
    try {
        await store.removeRegistry(name)
    } catch (err) {
        // Error is handled by store
    }
}

// Initialize data
onMounted(() => {
    store.getRegistries()
})
</script>