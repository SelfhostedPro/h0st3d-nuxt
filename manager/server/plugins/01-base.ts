import { spawn, spawnSync, fork } from 'node:child_process'
// import { spawn, spawnSync } from 'bun'
import { existsSync } from 'node:fs'
import { useBaseService } from '../utils/base/service'

export default defineNitroPlugin((nitro) => {
    console.log('starting base...')

    useBaseService.start()

    



    nitro.hooks.hook('close', async () => {
        console.log('closing base...')
        useBaseService.kill()
        console.log('base killed.')
    })

})


