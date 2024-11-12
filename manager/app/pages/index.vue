<template>
  <div class="p-8">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
      Dashboard
    </h1>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SystemStatusCard 
        :active-plugins="activePlugins"
      />
      <QuickActionsCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import SystemStatusCard from '~/components/dashboard/SystemStatusCard.vue'
import QuickActionsCard from '~/components/dashboard/QuickActionsCard.vue'
import { storeToRefs } from 'pinia'

const store = usePluginStore()
const { installedPlugins } = storeToRefs(store)

const activePlugins = computed(() =>
  installedPlugins.value.filter(p => p.state.enabled).length
)

onMounted(() => {
  store.refreshPlugins()
})
</script>
