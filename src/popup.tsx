import React from 'react'
import { createRoot } from 'react-dom/client'
import { deleteReport, getReports, getUrlInfo } from './serverFacade'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { CssBaseline } from '@mui/material'
import { App } from './components/App'
import { Settings } from './components/Settings'

const SETTINGS_KEY = 'VID_BUSTER_SETTINGS'

document.addEventListener('DOMContentLoaded', main)

async function main() {
    const url = await inspectedPageUrl()
    const root = createRoot(document.querySelector('#root')!)
    root.render(
        <CssBaseline>
            <App
                url={url}
                getUrlInfo={getUrlInfo}
                getSettings={getSettings}
                updateSettings={updateSettings}
                getReports={getReports}
                deleteReport={deleteReport}
            ></App>
        </CssBaseline>
    )
}

async function getSettings(): Promise<Settings> {
    return new Promise(resolve => {
        chrome.storage.sync.get([SETTINGS_KEY], result => {
            resolve(result[SETTINGS_KEY] || {})
        })
    })
}

async function updateSettings(settings: Settings): Promise<void> {
    return new Promise(resolve => {
        chrome.storage.sync.set({ [SETTINGS_KEY]: settings }, resolve)
    })
}

export async function inspectedPageUrl(): Promise<string> {
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
