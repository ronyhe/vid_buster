import React from 'react'
import { createRoot } from 'react-dom/client'
import { getUrlInfo, inspectedPageUrl } from './client'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { CssBaseline } from '@mui/material'
import { App } from './App'
import { Settings } from './Settings'

const SETTINGS_KEY = 'VID_BUSTER_SETTINGS'

async function getSettings(): Promise<Settings> {
    return new Promise((resolve) => {
        chrome.storage.sync.get([SETTINGS_KEY], (result) => {
            resolve(result[SETTINGS_KEY] || {})
        })
    })
}

async function updateSettings(settings: Settings): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [SETTINGS_KEY]: settings }, resolve)
    })
}

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
            ></App>
        </CssBaseline>,
    )
}

document.addEventListener('DOMContentLoaded', main)
