import downloader, { YtFormat } from 'youtube-dl-exec'
import { join } from 'node:path'
import { Format } from './messages'
import { Readable } from 'node:stream'

export async function getInfo(
    url: string,
): Promise<{ title: string | null; formats: Format[] }> {
    const result = await downloader(url, {
        flatPlaylist: true,
        dumpSingleJson: true,
    })
    return result as any
    // return {
    //     title: nullableString(result.title),
    //     formats: result.formats.toReversed().map(convertFromYtFormat),
    // }
}

export function downloadVideo(
    url: string,
    formatId: string,
    downloadDestination: string,
    title: string | null,
    extension: string | null,
): { promise: Promise<void>; stdout: Readable } {
    const subprocess = downloader.exec(url, {
        output: outputParam(downloadDestination, title, extension),
        format: formatId,
    })
    return {
        // @ts-ignore
        promise: subprocess,
        stdout: subprocess.stdout!,
    }
}

function convertFromYtFormat(f: YtFormat): Format {
    return {
        extension: nullableString(f.ext),
        note: nullableString(f.format_note),
        size: fileSizeString(f.filesize),
        resolution: resolution(f),
        id: f.format_id,
        url: f.url,
    }
}

function outputParam(
    downloadDestination: string,
    title: string | null,
    extension: string | null,
): string | undefined {
    if (!title) {
        return undefined // Punt to youtube-dl-exec's default
    }
    const extensionText = extension ? `.${extension}` : ''
    const fileName = `${title}${extensionText}`
    return join(downloadDestination, fileName)
}

function resolution(f: YtFormat): string {
    // @ts-ignore - resolution is not in the type definition, but I saw it in the actual response
    const res: string = f.resolution
    return nullableString(res) ?? `${f.width}x${f.height}`
}

function nullableString(s: string): string | null {
    if (s === undefined || s === null) {
        return null
    }
    const text = s.trim()
    if (!text) {
        return null
    }
    if (text === 'null' || text === 'undefined') {
        return null
    }
    return text
}

function fileSizeString(sizeInBytes: number): string {
    if (sizeInBytes === null || sizeInBytes === undefined) {
        return `???Mb`
    }
    const sizeInKb = Math.round(sizeInBytes / 1024)
    if (sizeInKb < 1024) {
        return `${sizeInKb}Kb`
    }
    const sizeInMb = Math.round(sizeInKb / 1024)
    if (sizeInMb < 1024) {
        return `${sizeInMb}Mb`
    }
    const sizeInGb = Math.round(sizeInMb / 1024)
    return `${sizeInGb}Gb`
}
