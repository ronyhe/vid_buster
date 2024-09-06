/** Communication between the server and the popup
 *
 * The download dialogue will generally go as follows:
 * Client -> Server: GetUrlInfo { url }
 * Server -> Client: UrlInfo { title, formats }
 * Client -> Server: Download { id, url, title, extension }
 *
 * A status update will go as follows:
 * Client -> Server: GetStatus
 * Server -> Client: Status { reports }
 */

export type Message = GetUrlInfo | UrlInfo | Download | GetStatus | Status

export const MessageKinds = {
    GetUrlInfo: 'getUrlInfo',
    UrlInfo: 'urlInfo',
    Download: 'download',
    GetStatus: 'getStatus',
    Status: 'status',
}

export interface GetUrlInfo {
    kind: typeof MessageKinds.GetUrlInfo
    url: string
}

export interface UrlInfo {
    kind: typeof MessageKinds.UrlInfo
    title: string | null
    formats: Format[]
}

export interface Download {
    kind: typeof MessageKinds.Download
    format_id: string
    filename: string
    destination: string
    url: string
}

export interface Format {
    extension: string | null
    note: string | null
    size: string
    resolution: string
    id: string
    url: string
    quality: string
}

export interface GetStatus {
    kind: typeof MessageKinds.GetStatus
}

export interface Status {
    kind: typeof MessageKinds.Status
    reports: SingleStatusReport[]
}

export interface SingleStatusReport {
    title: string
    status: string
}

export function getUrlInfoMessage(url: string): GetUrlInfo {
    return { kind: MessageKinds.GetUrlInfo, url }
}

export function urlInfoMessage(
    title: string | null,
    formats: Format[],
): UrlInfo {
    return { kind: MessageKinds.UrlInfo, title, formats }
}

export function downloadMessage(
    url: string,
    format_id: string,
    filename: string,
    destination: string,
): Download {
    return {
        kind: MessageKinds.Download,
        url,
        format_id,
        filename,
        destination,
    }
}

export function statusMessage(
    reports: {
        title: string
        status: string
    }[],
): Status {
    return { kind: MessageKinds.Status, reports }
}

export function getStatusMessage(): GetStatus {
    return { kind: MessageKinds.GetStatus }
}

export function isDownloadMessage(m: Message): m is Download {
    return m.kind === MessageKinds.Download
}

export function isUrlInfoMessage(m: Message): m is UrlInfo {
    return m.kind === MessageKinds.UrlInfo
}

export function isStatusMessage(m: Message): m is Status {
    return m.kind === MessageKinds.Status
}

export function isGetStatusMessage(m: Message): m is GetStatus {
    return m.kind === MessageKinds.GetStatus
}

export function isGetUrlInfoMessage(m: Message): m is GetUrlInfo {
    return m.kind === MessageKinds.GetUrlInfo
}
