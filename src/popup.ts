import { MessageKinds } from './messages'
import * as ui from './ui'

async function checkVideos() {
    ui.clear()
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabCount = tabs.length
    if (tabCount === 0) {
        return
    }
    if (tabCount > 1) {
        throw new Error('More than one active tab found in current window?')
    }
    const url = (tabs[0].url ?? '').trim()
    if (!url) {
        ui.error('No URL found')
        return
    }
    ui.status(`Fetching videos...`)
    try {
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
        ui.showFormats(res.formats)
    } catch (e) {
        ui.error(`Failed to fetch videos: ${e}`)
    }
}

function updateStatus(text: string) {
    const elem = document.querySelector('#status')
    if (elem) {
        elem.innerHTML = text
    }
}

checkVideos().catch((e) => {
    throw e
})
