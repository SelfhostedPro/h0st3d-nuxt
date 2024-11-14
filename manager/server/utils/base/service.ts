import { spawn, spawnSync, fork, type ChildProcess } from 'node:child_process'
// import { spawn, spawnSync } from 'bun'
import { cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import type { Hookable, HookKeys } from 'hookable'
import type { NitroRuntimeHooks } from 'nitropack/types'

export class BaseService {
    private basePath = '../base'
    public base: ChildProcess | undefined
    public hooks: Hookable<NitroRuntimeHooks, HookKeys<NitroRuntimeHooks>> | undefined

    async build() {
        spawnSync('bun', ['i'], { cwd: this.basePath, stdio: 'inherit', shell: true })
        spawnSync('nuxi', ['build'], { cwd: this.basePath, stdio: 'inherit', shell: true })
    }
    async start(hooks: Hookable<NitroRuntimeHooks, HookKeys<NitroRuntimeHooks>>) {
        this.hooks = hooks
        if (!existsSync(`${this.basePath}/.running`) || !existsSync(`${this.basePath}/node_modules`))
            await this.build()
        await this.initialize(false)
    }
    async rebuild() {
        spawnSync('bun', ['i'], { cwd: this.basePath, stdio: 'inherit', shell: true })
        spawnSync('nuxi', ['build'], { cwd: this.basePath, stdio: 'inherit', shell: true })
        await this.initialize()
    }
    async initialize(copy: boolean = true) {
        // If process is already running, kill it
        if (this.base && this.base.connected) {
            await this.kill()
        }
        // Copy over the running directory
        await cp(`${this.basePath}/.output`, `${this.basePath}/.running`, { recursive: true, force: true })
        this.base = fork('.running/server/index.mjs', [], { cwd: this.basePath, stdio: 'inherit' })

        // Listen for messages from the child process
        this.base.on('message', (message) => {
            this.hooks?.callHook('base:message', message)
        })
        // Rebuild the child process when the base is rebuilt
        this.hooks?.hook('base:rebuild', async (reason) => {
            console.log(`Rebuilding Child: ${reason}`)
            await this.rebuild()
        })
    }
    async kill() {
        this.base?.kill('SIGINT')
    }
}

export const useBaseService = new BaseService()
