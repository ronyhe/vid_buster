import React from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { CssBaseline } from '@mui/material'
import { App } from '../src/components/App'
import { Settings } from '../src/components/Settings'
import { getUrlInfo } from '../src/client'
import { urlInfoMessage } from '../src/messages'

let settings: Settings = {
    downloadDirectory: '~/Downloads',
}

const EXAMPLE_URL = 'https://www.example.com'
async function getInfo(url: string) {
    if (url === EXAMPLE_URL) {
        return urlInfoMessage('Example', [
            {
                extension: 'mp4',
                note: '720p',
                size: '80Mb',
                resolution: '1280x720',
                id: '398',
                url: EXAMPLE_URL,
            },
        ])
    }
    return getUrlInfo(url)
}

function main() {
    const root = createRoot(document.querySelector('#root')!)
    root.render(
        <CssBaseline>
            <App
                url={EXAMPLE_URL}
                getUrlInfo={getInfo}
                getSettings={async () => settings}
                updateSettings={async (s) => {
                    settings = s
                }}
            ></App>
        </CssBaseline>,
    )
}

document.addEventListener('DOMContentLoaded', main)
