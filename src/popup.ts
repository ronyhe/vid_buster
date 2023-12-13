import {
    asVideoResponseMessage,
    VideoRequestMessage,
    VideoResponseMessage,
} from './messages'

async function checkVideos() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabCount = tabs.length
    if (tabCount === 0) {
        return
    }
    if (tabCount > 1) {
        throw new Error('More than one active tab found in current window?')
    }
    const { id } = tabs[0]
    if (!id) {
        throw new Error('No tab ID found for active tab?')
    }
    const message: VideoRequestMessage = { kind: 'requestVideos' }
    const response = await sendMessage(id, message)
    if (!response) {
        const err = document.createElement('p')
        err.textContent =
            'No response from content script. Right-click and inspect this popup to see the error'
    }
    const { videos }: VideoResponseMessage = asVideoResponseMessage(response)
    videos.forEach(({ title, src }) => {
        const li = document.createElement('li')
        li.textContent = `${title} (${src})`
        document.body.appendChild(li)
    })
}

async function sendMessage(
    tabId: number,
    message: VideoRequestMessage,
): Promise<VideoResponseMessage | null> {
    try {
        return await chrome.tabs.sendMessage(tabId, message)
    } catch (e) {
        const message = `Failed to send message to tab ${tabId}: ${e}`
        console.error(message)
        return null
    }
}

checkVideos().catch((e) => {
    console.error(e)
    alert(e.message)
    throw e
})
