import { tryAsVideoRequestMessage, VideoResponseMessage } from './messages'

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const videoRequest = tryAsVideoRequestMessage(message)
    if (videoRequest) {
        const message: VideoResponseMessage = {
            kind: 'videosResponse',
            videos: [
                {
                    title: 'Video 1',
                    src: 'https://example.com/video1.mp4',
                },
                {
                    title: 'Video 2',
                    src: 'https://example.com/video2.mp4',
                },
            ],
        }
        // @ts-ignore
        sendResponse(message)
        return true
    }
})
