import { Interface as ReadLine } from 'readline'
import { TrackingReport } from '../messages'
export interface TerminalStreams {
    stdout: ReadLine
    stderr: ReadLine
}

type Key = number

export class Tracker {
    private map: Map<Key, TrackingReport> = new Map()
    private lastId = 0

    track(title: string, streams: TerminalStreams) {
        const key = this.lastId++
        this.map.set(key, {
            id: key,
            title,
            closed: false,
            error: null,
            lastStatus: ''
        })
        streams.stderr.on('line', line => {
            this.update(key, {
                error: line,
                closed: true
            })
        })
        streams.stdout.on('line', line => {
            this.update(key, {
                lastStatus: line
            })
        })
        streams.stdout.on('close', () => {
            this.update(key, {
                closed: true
            })
        })
    }

    update(key: Key, partialStatus: Partial<TrackingReport>) {
        this.map.set(key, {
            ...this.map.get(key)!,
            ...partialStatus
        })
    }

    delete(key: Key) {
        this.map.delete(key)
    }

    getStatus(): TrackingReport[] {
        return Array.from(this.map.values())
    }
}
