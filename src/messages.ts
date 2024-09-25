/** Communication between the server and the popup
 *
 * The download dialogue will generally go as follows:
 * Client -> Server: RequestUrlInfoMessage { url }
 * Server -> Client: ResponseUrlInfoMessage { title, formats }
 * Client -> Server: RequestDownloadMessage { format_id, url, filename, destination }
 *
 * A status update will go as follows:
 * Client -> Server: RequestReportsMessage
 * Server -> Client: ResponseReportsMessage { reports }
 */

export type Message =
    | RequestUrlInfoMessage
    | ResponseUrlInfoMessage
    | RequestDownloadMessage
    | RequestReportsMessage
    | ResponseReportsMessage

export const MessageKinds = {
    RequestUrlInfo: 'requestUrlInfo',
    ResponseUrlInfo: 'responseUrlInfo',
    RequestDownload: 'requestDownload',
    RequestReports: 'requestReports',
    ResponseReports: 'responseReports'
}

export interface RequestUrlInfoMessage {
    kind: typeof MessageKinds.RequestUrlInfo
    url: string
}

export interface ResponseUrlInfoMessage {
    kind: typeof MessageKinds.ResponseUrlInfo
    title: string
    formats: Format[]
}

export interface RequestDownloadMessage {
    kind: typeof MessageKinds.RequestDownload
    format_id: string
    filename: string
    destination: string
    url: string
}

export interface RequestReportsMessage {
    kind: typeof MessageKinds.RequestReports
}

export interface ResponseReportsMessage {
    kind: typeof MessageKinds.ResponseReports
    reports: TrackingReport[]
}

export interface Format {
    extension: string | null
    note: string | null
    size: string
    resolution: string
    id: string
    url: string
}

export interface TrackingReport {
    id: number
    closed: boolean
    error: string | null
    lastStatus: string
    title: string
}

export function createRequestUrlInfoMessage(
    url: string
): RequestUrlInfoMessage {
    return { kind: MessageKinds.RequestUrlInfo, url }
}

export function createResponseUrlInfoMessage(
    title: string,
    formats: Format[]
): ResponseUrlInfoMessage {
    return { kind: MessageKinds.ResponseUrlInfo, title, formats }
}

export function createRequestDownloadMessage(
    url: string,
    format_id: string,
    filename: string,
    destination: string
): RequestDownloadMessage {
    return {
        kind: MessageKinds.RequestDownload,
        url,
        format_id,
        filename,
        destination
    }
}

export function createRequestReportsMessage(): RequestReportsMessage {
    return { kind: MessageKinds.RequestReports }
}

export function createResponseReportsMessage(
    reports: TrackingReport[]
): ResponseReportsMessage {
    return {
        kind: MessageKinds.ResponseReports,
        reports
    }
}

export function isRequestUrlInfoMessage(
    m: Message
): m is RequestUrlInfoMessage {
    return m.kind === MessageKinds.RequestUrlInfo
}

export function isResponseUrlInfoMessage(
    m: Message
): m is ResponseUrlInfoMessage {
    return m.kind === MessageKinds.ResponseUrlInfo
}

export function isRequestDownloadMessage(
    m: Message
): m is RequestDownloadMessage {
    return m.kind === MessageKinds.RequestDownload
}

export function isRequestReportsMessage(
    m: Message
): m is RequestReportsMessage {
    return m.kind === MessageKinds.RequestReports
}

export function isResponseReportsMessage(
    m: Message
): m is ResponseReportsMessage {
    return m.kind === MessageKinds.ResponseReports
}
