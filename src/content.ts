import { tryAsVideoRequestMessage, VideoResponseMessage } from './messages'

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const videoRequest = tryAsVideoRequestMessage(message)
    if (videoRequest) {
        const videos = document.querySelectorAll('video')

        const message: VideoResponseMessage = {
            kind: 'videosResponse',
            videos: Array.from(videos).map(({ src, title }) => ({
                src,
                title,
            })),
        }
        // @ts-ignore
        sendResponse(message)
        return true
    }
})
