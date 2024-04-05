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
    id: string
    url: string
    title: string | null
    extension: string | null
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
    id: string,
    url: string,
    title: string | null,
    extension: string | null,
): Download {
    return { kind: MessageKinds.Download, id, url, title, extension }
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
