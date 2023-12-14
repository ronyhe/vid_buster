async function checkVideos() {
    document.querySelector('#vid-buster')?.remove()
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabCount = tabs.length
    if (tabCount === 0) {
        return
    }
    if (tabCount > 1) {
        throw new Error('More than one active tab found in current window?')
    }
    const tab = tabs[0]
    const { url } = tab
    const text = url ?? 'No URL found'
    const p = document.createElement('p')
    p.id = 'vid-buster'
    p.textContent = text
    document.body.appendChild(p)
}

checkVideos().catch((e) => {
    throw e
})
