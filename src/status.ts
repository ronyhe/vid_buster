import { Readable } from 'node:stream'

interface StatusTracker {
    track(title: string, stdout: Readable): void
    unTrack(title: string): void
    getReports(): { title: string; status: string }[]
}

function createTracker(): StatusTracker {
    const map: Map<string, { status: string; removeListener: () => void }> =
        new Map()
    return {
        track(title, stdout) {
            const listener = (chunk: any) => {
                const item = map.get(title)
                if (!item) {
                    throw new Error(`No item found for ${title}`)
                }
                item.status = chunk.toString()
            }
            map.set(title, {
                status: 'No status reported yet',
                removeListener: () => stdout.removeListener('data', listener),
            })
            stdout.addListener('data', listener)
        },
        unTrack(title: string) {
            const { removeListener } = map.get(title) ?? {}
            removeListener?.()
            map.delete(title)
        },
        getReports() {
            return Array.from(map.entries()).map(([title, { status }]) => ({
                title,
                status,
            }))
        },
    }
}
