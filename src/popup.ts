async function checkVideos() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabCount = tabs.length
    if (tabCount === 0) {
        return
    }
    if (tabCount > 1) {
        throw new Error('More than one active tab found in current window?')
    }
    const { url } = tabs[0]
    console.log(url)
}

checkVideos().catch((e) => {
    throw e
})
