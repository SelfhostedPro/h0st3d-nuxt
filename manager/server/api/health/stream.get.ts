import { healthService } from '~~/server/utils/health/service'

export default defineEventHandler(async (event) => {
    // Create a stream from the event
    const eventStream = createEventStream(event)

    // Create a stream from the health service
    const healthStream = await healthService.streamHealthInfo()
    const reader = healthStream.getReader()

    const encoder = new TextEncoder()
    const returnStream = new ReadableStream({
        async start(controller) {
            try {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    eventStream.push(`${JSON.stringify(value)}\n`)
                    controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`))
                }
            } catch (error) {
                console.error('Stream error:', error)
                controller.error(error)
            } finally {
                controller.close()
                reader.releaseLock()
            }
        }
    })

    eventStream.onClosed(async () => {
        await reader.cancel('Stream closed')
        reader.releaseLock()
        await returnStream.cancel('Stream closed')
        await healthStream.cancel('Stream closed')
    })

    return eventStream.send()
})