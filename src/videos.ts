import { Format } from './messages'
import util from 'node:util'
import child_process from 'node:child_process'
import { createInterface } from 'node:readline'
import { TerminalStreams } from './status'
const exec = util.promisify(require('node:child_process').exec)

export async function getInfo(
    url: string,
): Promise<{ title: string | null; formats: Format[] }> {
    const { stdout, stderr } = await exec(`yt-dlp -j --no-warnings ${url}`)
    if (stderr) {
        throw new Error(stderr)
    }
    const result = JSON.parse(stdout)
    return {
        title: result.title,
        formats: result.formats.map(jsonToFormat).reverse(),
    }
}

export function downloadVideo(
    url: string,
    formatId: string,
    downloadDestination: string,
): TerminalStreams {
    const command = `yt-dlp --no-warnings --newline -f ${formatId} -P ${downloadDestination} ${url}`
    console.log(command)
    const { stdout, stderr } = child_process.exec(command)
    if (!stdout) {
        throw new Error('No stdout')
    }
    if (!stderr) {
        throw new Error('No stderr')
    }
    return {
        stdout: createInterface(stdout),
        stderr: createInterface(stderr),
    }
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

function jsonToFormat(json: any): Format {
    return {
        extension: json.ext,
        note: json.format_note,
        size: fileSizeString(json.filesize ?? json.filesize_approx),
        resolution: json.resolution,
        id: json.format_id,
        url: json.url,
        quality: json.quality,
    }
}
