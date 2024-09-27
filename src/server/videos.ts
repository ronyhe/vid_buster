import { Format } from '../messages'
import child_process from 'node:child_process'
import { createInterface } from 'node:readline'
import { TerminalStreams } from './tracking'
import { createProc, execJson, Proc } from './proc'

export async function getInfo(
    url: string
): Promise<{ title: string; formats: Format[] }> {
    const command = `yt-dlp --dump-single-json --flat-playlist --no-warnings "${url}"`
    console.log('command:', command)
    const result = await execJson<{ title: string; formats: never[] }>(command)
    return {
        title: result.title,
        formats: result.formats.map(jsonToFormat).reverse()
    }
}

export function downloadVideo(
    url: string,
    formatId: string,
    downloadDestination: string,
    filename: string
): Proc {
    const command = `yt-dlp --no-warnings --newline -f ${formatId} -P "${downloadDestination}" -o "${filename}" "${url}"`
    console.log('command:', command)
    return createProc(command)
}

function fileSizeString(sizeInBytes: number): string {
    if (sizeInBytes === null || sizeInBytes === undefined) {
        return `?Mb`
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

function jsonToFormat(json: Record<string, never>): Format {
    return {
        extension: json.ext,
        note: json.format_note,
        size: fileSizeString(json.filesize ?? json.filesize_approx),
        resolution: json.resolution,
        id: json.format_id,
        url: json.url
    }
}
