import React from 'react'
import { Format, UrlInfo } from '../messages'
import { useState } from 'react'
import { FormatList } from './FormatList'
import { Box, Typography } from '@mui/material'
import { DestinationDialog } from './DestinationDialog'
import { Loader } from './Loader'

type OnChoose = (format: Format, filename: string) => void

export interface UrlDisplayProps {
    load(): Promise<UrlInfo>
    onChoose: OnChoose
}

interface InternalProps {
    info: UrlInfo
    onChoose: OnChoose
}

export function UrlDisplay({ load, onChoose }: UrlDisplayProps) {
    return (
        <Loader
            getData={load}
            createContent={(info) => (
                <Internal info={info} onChoose={onChoose} />
            )}
            createError={(e) => (
                <Box>
                    <Typography variant="h6">Error loading URL</Typography>
                    <Typography>{e.message}</Typography>
                </Box>
            )}
        />
    )
}

function Internal({ info, onChoose }: InternalProps) {
    const [format, setFormat] = useState<Format | null>(null)
    return (
        <Box padding={2}>
            <FormatList
                onChoose={(f) => {
                    setFormat(f)
                }}
                info={info}
            />
            <DestinationDialog
                open={format !== null}
                onClose={(filename) => {
                    if (filename !== null) {
                        onChoose(format!, filename)
                    }
                    setFormat(null)
                }}
                title={info.title ?? undefined}
                extension={format?.extension ?? undefined}
            />
        </Box>
    )
}
