import {
    tryAsVideoRequestMessage,
    Video,
    VideoResponseMessage,
    VideoSource,
} from './messages'

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const videoRequest = tryAsVideoRequestMessage(message)
    if (videoRequest) {
        const videos = document.querySelectorAll('video')

        const message: VideoResponseMessage = {
            kind: 'videosResponse',
            videos: Array.from(videos).map(videoFromVideoElement),
        }
        // @ts-ignore
        sendResponse(message)
        return true
    }
})

function videoFromVideoElement(video: HTMLVideoElement): Video {
    return {
        title: video.title,
        sources: sourcesFromVideoElement(video),
    }
}

function sourcesFromVideoElement(video: HTMLVideoElement): VideoSource[] {
    const sources: VideoSource[] = []
    if (video.src.trim().length > 0) {
        sources.push({
            src: video.src,
            type: '(NoType)',
            media: '(NoMedia)',
        })
    }
    for (let i = 0; i < video.children.length; i++) {
        const child = video.children[i]
        if (child.tagName === 'SOURCE') {
            const source = child as HTMLSourceElement
            sources.push({
                src: source.src,
                type: source.type,
                media: source.media,
            })
        }
    }
    return sources
}
