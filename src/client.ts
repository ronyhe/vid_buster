import { getUrlInfoMessage, Message, UrlInfo } from './messages'

export async function getUrlInfo(): Promise<UrlInfo> {
    const url = await inspectedPageUrl()
    return await sendMessage(getUrlInfoMessage(url))
}

async function sendMessage<Result extends Message>(
    message: Message,
): Promise<Result> {
    const response = await fetch(`http://localhost:3000/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    if (!response.ok) {
        let err = `Request failed: ${response.statusText}; `
        try {
            err = `${err} ${await response.text()}`
        } catch (e) {
            // Ignore
        }
        throw new Error(err)
    }
    const res = await response.json()
    if (res.error) {
        throw new Error(res.error)
    }
    return res as Result
}

async function inspectedPageUrl(): Promise<string> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tabCount = tabs.length
    if (tabCount === 0) {
        throw new Error('No active tab found in current window?')
    }
    if (tabCount > 1) {
        throw new Error('More than one active tab found in current window?')
    }
    const url = (tabs[0].url ?? '').trim()
    if (!url) {
        throw new Error('No URL found')
    }
    return url
}
