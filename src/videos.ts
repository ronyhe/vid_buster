import downloader from 'youtube-dl-exec'

export async function getVideos(url: string) {
    return await downloader(url, {
        flatPlaylist: true,
        dumpJson: true,
    })
}
