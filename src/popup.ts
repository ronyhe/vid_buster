import {
    downloadMessage,
    Format,
    getStatusMessage,
    getUrlInfoMessage,
    Message,
    Status,
    UrlInfo,
} from './messages'
import * as ui from './ui'

showPopup().catch((e) => {
    throw e
})

let interval: number | null = null

async function showPopup() {
    ui.showInitialPopup(checkVideos)
    await fetchAndShowReports()
    interval = window.setInterval(() => {
        fetchAndShowReports().catch((e) => {
            clearInterval()
            ui.error(`Failed to fetch reports: ${e}`)
        })
    }, 500)
}

function clearInterval() {
    if (interval !== null) {
        window.clearInterval(interval)
        interval = null
    }
}

async function fetchAndShowReports() {
    const { reports }: Status = await sendMessage(getStatusMessage())
    ui.showReports(reports, checkVideos)
}

async function checkVideos() {
    clearInterval()
    ui.status(`Fetching videos...`)
    const url = await currentTabUrl()
    try {
        const { title, formats }: UrlInfo = await sendMessage(
            getUrlInfoMessage(url),
        )
        ui.showFormats(title, formats, (f) => downloadFormat(url, title, f))
    } catch (e) {
        ui.error(`Failed to fetch videos: ${e}`)
    }
}

async function downloadFormat(url: string, title: string | null, f: Format) {
    ui.status(`Downloading...`)
    try {
        await sendMessage(downloadMessage(f.id, url, title, f.extension))
        ui.status(`Download request sent`)
    } catch (e) {
        ui.error(`Failed to download: ${e}`)
    }
}

async function currentTabUrl(): Promise<string> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabCount = tabs.length
    if (tabCount === 0) {
        throw new Error('No active tab found in current window?')
    }
    if (tabCount > 1) {
        throw new Error('More than one active tab found in current window?')
    }
    const url = (tabs[0].url ?? '').trim()
    if (!url) {
        ui.error('No URL found')
        throw new Error('No URL found')
    }
    return url
}

async function sendMessage<Result extends Message>(
    message: Message,
): Promise<Result> {
    const response = await fetch(`http://localhost:3000/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    if (!response.ok) {
        let err = `Request failed: ${response.statusText}; `
        try {
            err = `${err} ${await response.text()}`
        } catch (e) {
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
