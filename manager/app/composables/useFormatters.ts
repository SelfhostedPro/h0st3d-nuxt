export function useFormatters() {
    function formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = [
            "Bytes",
            "KiB",
            "MiB",
            "GiB",
            "TiB",
            "PiB",
            "EiB",
            "ZiB",
            "YiB",
        ];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function formatUptime(seconds: number): string {
        const days = Math.floor(seconds / (24 * 60 * 60))
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
        const minutes = Math.floor((seconds % (60 * 60)) / 60)
        const secs = Math.floor(seconds % 60)

        const parts = []
        if (days > 0) parts.push(`${days}d`)
        if (hours > 0) parts.push(`${hours}h`)
        if (minutes > 0) parts.push(`${minutes}m`)
        parts.push(`${secs}s`)

        return parts.join(' ')
    }

    function formatCPU(value: number): string {
        return (value / 1000000).toFixed(2) + 'ms'
    }

    return {
        formatBytes,
        formatUptime,
        formatCPU,
    }
}
