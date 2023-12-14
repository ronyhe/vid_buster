import downloader, { YtFormat } from 'youtube-dl-exec'

export async function getFormats(url: string): Promise<Format[]> {
    const result = await downloader(url, {
        flatPlaylist: true,
        dumpSingleJson: true,
    })
    return result.formats.toSorted(compareYtFormats).map(convertFromYtFormat)
}

export interface Format {
    extension: string
    note: string
    size: number
    resolution: string
    id: string
    url: string
}

function compareYtFormats(a: YtFormat, b: YtFormat): number {
    return a.quality - b.quality
}

function convertFromYtFormat(f: YtFormat): Format {
    return {
        extension: f.ext,
        note: f.format_note,
        size: f.filesize,
        resolution: resolution(f),
        id: f.format_id,
        url: f.url,
    }
}

function resolution(f: YtFormat): string {
    // @ts-ignore - resolution is not in the type definition, but I saw it in the actual response
    const res: string = f.resolution
    return res ?? `${f.width}x${f.height}`
}
