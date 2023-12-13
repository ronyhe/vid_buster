import { Message } from './messages'

async function main() {
    const videoElements = document.querySelectorAll('video')
    const videos = Array.from(videoElements).map((video) => ({
        src: video.src,
    }))
    const message: Message = { kind: 'videos', videos }
    await chrome.runtime.sendMessage(message)
}

main().catch((e) => {
    console.error(e)
    throw e
})
