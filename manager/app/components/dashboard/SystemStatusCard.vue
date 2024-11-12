<template>
  <Card>
    <CardHeader>
      <CardTitle>System Status</CardTitle>
      <CardDescription>Current system metrics and health</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <SystemMetric label="Uptime" :value="`process: ${formatUptime(processUptime)} | ${formatUptime(uptime)}`" />
        <SystemMetric label="Load"
          :value="`1m: ${load[0]?.toFixed(2)} | 5m: ${load[1]?.toFixed(2)} | 15m: ${load[2]?.toFixed(2)}`" />
        <SystemMetric label="CPU Usage"
          :value="`User: ${formatCPU(cpuUsage.user)} | System: ${formatCPU(cpuUsage.system)}`" />

        <ResourceUsageMetric label="Memory Usage" :used="memoryUsage.heapUsed" :total="memoryTotal"
          :percentage="memoryPercentage" :format="formatBytes" />

        <ResourceUsageMetric label="Disk Usage" :used="diskUsage.total - diskUsage.free" :total="diskUsage.total"
          :percentage="diskPercentage" :format="formatBytes" :available="diskUsage.available"
          :formatAvailable="formatBytes" />

        <SystemInfoGrid :pid="pid" :platform="platform" :nodeVersion="nodeVersion" :activePlugins="activePlugins" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHealthMonitor } from '~/composables/useHealthMonitor'
import { useFormatters } from '~/composables/useFormatters'
import SystemMetric from './SystemMetric.vue';
import ResourceUsageMetric from './ResourceUsageMetric.vue';
import SystemInfoGrid from './SystemInfoGrid.vue';

const props = defineProps<{
  activePlugins: number
}>()

const {
  uptime,
  processUptime,
  memoryUsage,
  cpuUsage,
  pid,
  platform,
  nodeVersion,
  load,
  diskUsage,
  memoryTotal,
  diskPercentage,
  memoryPercentage,
  initializeHealthMonitoring,
} = useHealthMonitor()

const { formatBytes, formatUptime, formatCPU } = useFormatters()

onMounted(() => {
  initializeHealthMonitoring()
})
</script>
