import downloader, { YtFormat } from 'youtube-dl-exec'
import { join } from 'node:path'
import { Format } from './messages'
import { Readable } from 'node:stream'
import util from 'node:util'
import child_process from 'node:child_process'
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
        formats: result.formats
            .map((fmt: any) => {
                return {
                    extension: fmt.ext,
                    note: fmt.format_note,
                    size: fileSizeString(fmt.filesize ?? fmt.filesize_approx),
                    resolution: fmt.resolution,
                    id: fmt.format_id,
                    url: fmt.url,
                    quality: fmt.quality,
                }
            })
            .reverse(),
    }
}

export async function downloadVideo(
    url: string,
    formatId: string,
): Promise<void> {
    const downloadDestination = '~/Downloads/'
    const command = `yt-dlp --no-warnings --newline -f ${formatId} -P ${downloadDestination} ${url}`
    console.log(command)
    const { stdout, stderr } = await exec(command)
    console.log(stdout.toString())
    if (stderr) {
        console.error(stderr)
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
