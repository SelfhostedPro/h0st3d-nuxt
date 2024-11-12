import type { ProcessHealthInfo } from '~~/types';
import { totalmem, cpus, loadavg, uptime, networkInterfaces, platform } from 'node:os';
import { checkSync } from 'diskusage';

let rootPath = platform() === 'win32' ? 'c:' : '/';
export class ProcessHealthService {
    async getHealthInfo(): Promise<ProcessHealthInfo> {
        const memoryUsage = process.memoryUsage();
        const load = loadavg();
        const totalcpus = cpus().length;
        const totalmemory = totalmem();
        const hostUptime = uptime();
        const diskUsage = checkSync(rootPath);
        return {
            uptime: process.uptime(),
            memoryUsage: {
                heapTotal: Math.round(memoryUsage.heapTotal),
                heapUsed: Math.round(memoryUsage.heapUsed),
                rss: Math.round(memoryUsage.rss),
            },
            hostInfo: {
                load: load,
                totalcpus: totalcpus,
                totalmem: totalmemory,
                uptime: hostUptime,
                diskUsage: diskUsage
            },
            cpuUsage: process.cpuUsage(),
            pid: process.pid,
            platform: process.platform,
            nodeVersion: process.version
        };
    }

    async streamHealthInfo(): Promise<ReadableStream<ProcessHealthInfo>> {
        return new ReadableStream({
            start: (controller) => {
                const interval = setInterval(async () => {
                    try {
                        controller.enqueue(await this.getHealthInfo());
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

export const healthService = new ProcessHealthService();
