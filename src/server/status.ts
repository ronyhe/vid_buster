import { Interface as ReadLine } from 'readline'
export interface TerminalStreams {
    stdout: ReadLine
    stderr: ReadLine
}

interface Status {
    closed: boolean
    error: string | null
    last: string
}

type Key = string

export class Tracker {
    private map: Map<Key, Status> = new Map()

    track(key: Key, streams: TerminalStreams) {
        this.map.set(key, {
            closed: false,
            error: null,
            last: ''
        })
        streams.stderr.on('line', line => {
            this.update(key, {
                error: line,
                closed: true
            })
        })
        streams.stdout.on('line', line => {
            this.update(key, {
                last: line
            })
        })
        streams.stdout.on('close', () => {
            this.update(key, {
                closed: true
            })
        })
    }

    update(key: Key, partialStatus: Partial<Status>) {
        this.map.set(key, {
            ...this.map.get(key)!,
            ...partialStatus
        })
    }

    delete(key: Key) {
        this.map.delete(key)
    }

    getReports() {
        return Array.from(this.map.entries())
            .map(([key, status]) => ({
                title: key,
                status: status.last
            }))
            .sort((a, b) =>
                a.title.localeCompare(b.title, undefined, { numeric: true })
            )
    }
}
