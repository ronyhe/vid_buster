import React, { useState } from 'react'
import { Box, TextField } from '@mui/material'
import { UrlDisplay } from './UrlDisplay'
import { Format, UrlInfo } from '../messages'

export interface CustomUrlProps {
    onChoose(format: Format, filename: string): void
    getUrlInfo(url: string): Promise<UrlInfo>
}

export function CustomUrl({ onChoose, getUrlInfo }: CustomUrlProps) {
    const [url, setUrl] = useState<string | null>(null)
    const form = (
        <form
            onSubmit={(e) => {
                e.preventDefault()
            }}
        >
            <TextField
                onChange={(e) => {
                    setUrl(e.target.value)
                }}
            />
        </form>
    )
    const content = url !== null && (
        <UrlDisplay load={() => getUrlInfo(url)} onChoose={onChoose} />
    )
    return (
        <Box padding={2}>
            {form}
            {content}
        </Box>
    )
}
