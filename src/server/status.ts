import { Interface as ReadLine } from 'readline'
export interface TerminalStreams {
    stdout: ReadLine
    stderr: ReadLine
}

type Key = string

export class Tracker {
    private map: Map<Key, string> = new Map()

    track(key: Key, streams: TerminalStreams) {
        if (!this.map.has(key)) {
            this.map.set(key, 'No status yet')
        }
        streams.stderr.on('data', chunk => {
            console.error(`Error for ${key}:`)
            console.error(chunk.toString())
        })
        streams.stdout.on('line', line => {
            this.map.set(key, line)
        })
        streams.stdout.on('close', () => {
            this.map.delete(key)
        })
    }

    getReports() {
        return Array.from(this.map.entries())
            .map(([key, status]) => ({
                title: key,
                status,
            }))
            .sort((a, b) =>
                a.title.localeCompare(b.title, undefined, { numeric: true }),
            )
    }
}
