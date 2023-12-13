chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.kind === 'check-videos') {
        // @ts-ignore
        sendResponse({ kind: 'check-videos-response' })
        return undefined
    }
})
