import React from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { CssBaseline } from '@mui/material'
import { App } from '../src/components/App'
import { Settings } from '../src/components/Settings'
import { getUrlInfo } from '../src/serverFacade'
import { createResponseUrlInfoMessage } from '../src/messages'

let settings: Settings = {
    downloadDirectory: '~/Downloads'
}

const EXAMPLE_URL = 'https://www.example.com'
async function getInfo(url: string) {
    if (url === EXAMPLE_URL) {
        return createResponseUrlInfoMessage('Example', [
            {
                extension: 'mp4',
                note: '720p',
                size: '80Mb',
                resolution: '1280x720',
                id: '398',
                url: EXAMPLE_URL
            }
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
                updateSettings={async s => {
                    settings = s
                }}
                getReports={async () => [
                    {
                        id: 1,
                        closed: false,
                        error: null,
                        lastStatus:
                            '0.5% of  104.29MiB at   10.86MiB/s ETA 00:09',
                        title: 'Example'
                    },
                    {
                        id: 2,
                        closed: true,
                        error: 'Failed to download',
                        lastStatus: 'whatever',
                        title: 'Example 2'
                    },
                    {
                        id: 3,
                        closed: true,
                        error: null,
                        lastStatus: 'Downloaded',
                        title: 'Example 3'
                    }
                ]}
            ></App>
        </CssBaseline>
    )
}

document.addEventListener('DOMContentLoaded', main)
