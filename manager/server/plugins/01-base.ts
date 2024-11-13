import { useBaseService } from '../utils/base/service'
import type { Serializable } from 'node:child_process'

export default defineNitroPlugin((nitro) => {
    console.log('starting base...')

    useBaseService.start(nitro.hooks)


    nitro.hooks.hook('base:message', async () => {
        console.log('base message')
    })

    nitro.hooks.hook('close', async () => {
        console.log('closing base...')
        useBaseService.kill()
        console.log('base killed.')
    })
})

declare module 'nitropack' {
    interface NitroRuntimeHooks {
        'base:message': (message: Serializable) => void;
        'base:rebuild': (reason?: string) => void;
        'base:error': () => void;
    }
}