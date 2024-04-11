import React from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { CssBaseline } from '@mui/material'
import App from './src/App'

function main() {
    const root = createRoot(document.querySelector('body')!)
    root.render(
        <CssBaseline>
            <App></App>
        </CssBaseline>,
    )
}

document.addEventListener('DOMContentLoaded', main)
