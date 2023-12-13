export interface Message {
    kind: 'videos'
    videos: Video[]
}

export interface Video {
    src: string
}
