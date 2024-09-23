import {
    downloadMessage,
    getStatusMessage,
    getUrlInfoMessage,
    Message,
    SingleStatusReport,
    Status,
    UrlInfo
} from '../messages'

export async function getUrlInfo(url: string): Promise<UrlInfo> {
    return await sendMessage(getUrlInfoMessage(url))
}

export async function downloadFormat(
    url: string,
    format_id: string,
    filename: string,
    destination: string
): Promise<void> {
    await sendMessage(downloadMessage(url, format_id, filename, destination))
}

export async function getReports(): Promise<SingleStatusReport[]> {
    const res: Status = await sendMessage(getStatusMessage())
    return res.reports
}

async function sendMessage<Result extends Message>(
    message: Message
): Promise<Result> {
    const response = await fetch(`http://localhost:3000/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    if (!response.ok) {
        let err = `Request failed: ${response.statusText}; `
        try {
            err = `${err} ${await response.text()}`
        } catch (_) {
            // Ignore
        }
        throw new Error(err)
    }
    const res = await response.json()
    if (res.error) {
        throw new Error(res.error)
    }
    return res as Result
}
