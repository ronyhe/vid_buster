type Message = VideoRequestMessage | VideoResponseMessage

export interface VideoRequestMessage {
    kind: 'requestVideos'
}

export interface VideoResponseMessage {
    kind: 'videosResponse'
    videos: Video[]
}

export interface Video {
    title: string
    src: string
}

export function tryAsVideoRequestMessage(
    message: Message,
): VideoRequestMessage | null {
    if (message.kind === 'requestVideos') {
        return message
    } else {
        return null
    }
}

export function asVideoResponseMessage(message: any): VideoResponseMessage {
    if (message.kind === 'videosResponse') {
        return message
    }
    throw new Error(
        `Unexpected message kind: ${message.kind} should be videosResponse`,
    )
}
