import type { DiskUsage } from 'diskusage'
export interface ProcessHealthInfo {
    uptime: number; // Seconds process has been running
    memoryUsage: {
        heapTotal: number; // Total heap size in MB
        heapUsed: number; // Used heap size in MB
        rss: number; // Resident set size in MB
    };
    cpuUsage: {
        user: number; // CPU time spent in user code
        system: number; // CPU time spent in system code
    };
    hostInfo: {
        totalcpus: number; // Number of CPUs
        totalmem: number; // Total memory in MB
        load: number[]; // Load average
        uptime: number; // Uptime in seconds
        diskUsage: DiskUsage; // Disk usage information
    }
    pid: number; // Process ID
    platform: string; // Operating system platform
    nodeVersion: string; // Node.js version
}