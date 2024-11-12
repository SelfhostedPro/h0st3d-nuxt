export class ProcessHealthService {
    getHealthInfo(): ProcessHealthInfo {
        const memoryUsage = process.memoryUsage();

        return {
            uptime: process.uptime(),
            memoryUsage: {
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                rss: Math.round(memoryUsage.rss / 1024 / 1024),
            },
            cpuUsage: process.cpuUsage(),
            pid: process.pid,
            platform: process.platform,
            nodeVersion: process.version
        };
    }

    streamHealthInfo(): ReadableStream<ProcessHealthInfo> {
        return new ReadableStream({
            start: (controller) => {
                const interval = setInterval(() => {
                    try {
                        controller.enqueue(this.getHealthInfo());
                    } catch (error) {
                        controller.error(error);
                    }
                }, 1000);

                // Allow the stream to be cancelled
                return () => {
                    clearInterval(interval);
                };
            }
        });
    }
}

interface ProcessHealthInfo {
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
    pid: number; // Process ID
    platform: string; // Operating system platform
    nodeVersion: string; // Node.js version
}

export const healthService = new ProcessHealthService();
