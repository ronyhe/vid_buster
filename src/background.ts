chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message received')
    if (message.kind === 'videos') {
        console.log('videos', message.videos)
        return true
    }
})

chrome.action.onClicked.addListener((tab) => {
    console.log(tab)
})
