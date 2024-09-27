import { TrackingReport } from '../messages'
import { Proc } from './proc'
import { ignoreErrors } from '../utils'

interface TrackingReportWithProc extends TrackingReport {
    proc: Proc
}

type Key = number

export class Tracker {
    private map: Map<Key, TrackingReportWithProc> = new Map()
    private lastId = 0

    track(title: string, proc: Proc): number {
        const key = this.lastId++
        this.map.set(key, {
            id: key,
            title,
            closed: false,
            error: null,
            lastStatus: '',
            proc
        })
        proc.stderr.on('line', line => {
            this.update(key, {
                error: line,
                closed: true
            })
        })
        proc.stdout.on('line', line => {
            this.update(key, {
                lastStatus: line
            })
        })
        proc.stdout.on('close', () => {
            this.update(key, {
                closed: true
            })
        })
        return key
    }

    update(key: Key, partialStatus: Partial<TrackingReport>) {
        this.map.set(key, {
            ...this.map.get(key)!,
            ...partialStatus
        })
    }

    delete(key: Key) {
        const report = this.map.get(key)
        ignoreErrors(() => report!.proc.kill())
        this.map.delete(key)
    }

    getStatus(): TrackingReport[] {
        return Array.from(this.map.values()).map(
            ({ proc: _proc, ...rest }) => rest
        )
    }
}
