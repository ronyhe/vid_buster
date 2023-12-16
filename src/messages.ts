/** Communication between the server and the popup
 *
 * The dialogue will generally go as follows:
 * Client -> Server: GetUrlInfo { url }
 * Server -> Client: UrlInfo { title, formats }
 * Client -> Server: Download { id, url, title, extension }
 */

export type Message = GetUrlInfo | UrlInfo | Download

export const MessageKinds = {
    GetUrlInfo: 'getUrlInfo',
    UrlInfo: 'urlInfo',
    Download: 'download',
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
