import { MessageKinds } from './messages'
import { YtResponse } from 'youtube-dl-exec'
import { Format } from './videos'

async function checkVideos() {
    document.querySelector('#vid-buster')?.remove()
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
        updateStatus('No URL found')
        return
    }
    updateStatus(`Fetching videos`)
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
            updateStatus(`Error: ${res.error}`)
            return
        }
        updateStatus(
            res.formats
                .map((f: Format) => `${f.note} ${f.resolution}`)
                .join(', '),
        )
    } catch (e) {
        updateStatus(`Error: ${e}`)
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
