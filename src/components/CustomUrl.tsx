import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { UrlDisplay } from './UrlDisplay'
import { Format, UrlInfo } from '../messages'

export interface CustomUrlProps {
    onChoose(format: Format, filename: string): void
    getUrlInfo(url: string): Promise<UrlInfo>
}

export function CustomUrl({ onChoose, getUrlInfo }: CustomUrlProps) {
    const [value, setValue] = useState('')
    const [url, setUrl] = useState<string | null>(null)
    const form = (
        <TextField
            autoFocus={true}
            variant={'standard'}
            label={'Video URL'}
            fullWidth={true}
            InputProps={{
                endAdornment: (
                    <Button variant="text" onClick={() => setUrl(value)}>
                        GO
                    </Button>
                ),
            }}
            onChange={(e) => {
                setValue(e.target.value)
            }}
        />
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
