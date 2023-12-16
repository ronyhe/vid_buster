import { MessageKinds } from './messages'
import * as ui from './ui'
import { Format } from './videos'

async function checkVideos() {
    try {
        ui.status(`Fetching videos...`)
        const url = await currentTabUrl()
        const response = await fetch(`http://localhost:3000/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ kind: MessageKinds.GetUrlInfo, url }),
        })
        const res = await response.json()
        if (res.error) {
            ui.error(res.error)
            return
        }
        ui.showFormats(res.title, res.formats, (f) => downloadFormat(url, f))
    } catch (e) {
        ui.error(`Failed to fetch videos: ${e}`)
    }
}

async function downloadFormat(url: string, f: Format) {
    ui.status(`Downloading...`)
    try {
        await fetch(`http://localhost:3000/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kind: MessageKinds.Download,
                id: f.id,
                url,
            }),
        })
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

checkVideos().catch((e) => {
    throw e
})
