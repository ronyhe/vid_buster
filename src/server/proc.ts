/** A facade for CMD processes */
import child_process from 'node:child_process'
import { createInterface } from 'node:readline'
import { exec as _exec } from 'node:child_process'
import util from 'node:util'
const simpleExec = util.promisify(_exec)

export interface StdStream {
    on(event: 'line' | 'close', listener: (line: string) => void): void
}

export interface Proc {
    stdout: StdStream
    stderr: StdStream
    kill(): void
}

export function createProc(command: string): Proc {
    const { stdout, stderr, kill } = child_process.exec(command)
    if (!stdout) {
        throw new Error('No stdout')
    }
    if (!stderr) {
        throw new Error('No stderr')
    }
    return {
        stdout: createInterface(stdout),
        stderr: createInterface(stderr),
        kill
    }
}

export async function execJson<T>(command: string): Promise<T> {
    const { stdout, stderr } = await simpleExec(command)
    if (stderr) {
        throw new Error(stderr)
    }
    return JSON.parse(stdout)
}
