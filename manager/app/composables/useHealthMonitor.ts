import { ref } from 'vue'
import { useEventSource } from '@vueuse/core'
import type { ProcessHealthInfo } from '~~/types'
import type { DiskUsage } from 'diskusage'

export function useHealthMonitor() {
  const uptime = ref<number>(0)
  const processUptime = ref<number>(0)
  const memoryUsage = ref<ProcessHealthInfo['memoryUsage']>({ heapTotal: 0, heapUsed: 0, rss: 0 })
  const cpuUsage = ref<ProcessHealthInfo['cpuUsage']>({ user: 0, system: 0 })
  const pid = ref<number>(0)
  const platform = ref<string>('')
  const nodeVersion = ref<string>('')
  const load = ref<number[]>([])
  const diskUsage = ref<DiskUsage>({ total: 0, free: 0, available: 0 })
  const memoryTotal = ref<number>(0)
  const diskPercentage = ref<number>(0)
  const memoryPercentage = ref<number>(0)
  const cpuPercentage = ref<number>(0)

  function updateMetrics(data: ProcessHealthInfo) {
    uptime.value = data.hostInfo.uptime
    processUptime.value = data.uptime
    memoryUsage.value = data.memoryUsage
    cpuUsage.value = data.cpuUsage
    pid.value = data.pid
    platform.value = data.platform
    nodeVersion.value = data.nodeVersion
    memoryTotal.value = data.hostInfo.totalmem
    load.value = data.hostInfo.load
    diskUsage.value = data.hostInfo.diskUsage
    
    diskPercentage.value = ((diskUsage.value.total - diskUsage.value.available) / diskUsage.value.total) * 100
    memoryPercentage.value = data.memoryUsage.heapTotal / data.hostInfo.totalmem * 100
    cpuPercentage.value = getCPUPercentage()
  }

  function getCPUPercentage(): number {
    const total = cpuUsage.value.user + cpuUsage.value.system
    const maxCPU = 1000000 // 1 second in microseconds
    return Math.min((total / maxCPU) * 100, 100)
  }

  async function initializeHealthMonitoring() {
    const { eventSource, error } = useEventSource('/api/health/stream', [], {
      autoReconnect: {
        retries: 3,
        delay: 2000,
        async onFailed() {
          console.error('Failed to connect to health stream after 3 retries. Reverting to fetch')
          const fetchData = await $fetch('/api/health') as ProcessHealthInfo
          updateMetrics(fetchData)
        },
      }
    })

    if (error.value || !eventSource.value) {
      throw createError({ statusCode: 500, message: `${JSON.stringify(error.value)}` })
    }

    eventSource.value.onopen = () => console.info('Connected to health stream')
    eventSource.value.onerror = (error) => console.error('Error from health stream:', error)
    eventSource.value.onmessage = (event) => {
      const parsedData = JSON.parse(event.data) as ProcessHealthInfo
      updateMetrics(parsedData)
    }
  }

  return {
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
    cpuPercentage,
    initializeHealthMonitoring,
  }
}
