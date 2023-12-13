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
    let response
    try {
        response = await chrome.tabs.sendMessage(id, message)
    } catch (e) {
        console.error(e)
        alert(e)
        throw e
    }
    const { videos }: VideoResponseMessage = asVideoResponseMessage(response)
    videos.forEach(({ title, src }) => {
        const li = document.createElement('li')
        li.textContent = `${title} (${src})`
        document.body.appendChild(li)
    })
}

checkVideos().catch((e) => {
    console.error(e)
    alert(e.message)
    throw e
})
