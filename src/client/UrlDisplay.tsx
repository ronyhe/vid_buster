import React, { useEffect } from 'react'
import { Format, UrlInfo } from '../messages'
import { useState } from 'react'
import { Spinner } from './Spinner'
import { FormatList } from './FormatList'
import { Box, Typography } from '@mui/material'
import { DestinationDialog } from './DestinationDialog'

export interface UrlDisplayProps {
    load(): Promise<UrlInfo>
    onChoose(format: Format, filename: string): void
}

type State =
    | { state: 'loading' }
    | { state: 'error'; err: unknown }
    | { state: 'success'; info: UrlInfo }

export function UrlDisplay({ load, onChoose }: UrlDisplayProps) {
    const [state, setState] = useState<State>({ state: 'loading' })
    const [format, setFormat] = useState<Format | null>(null)
    useEffect(() => {
        ;(async () => {
            try {
                const info = await load()
                setState({ state: 'success', info })
            } catch (e) {
                setState({ state: 'error', err: e })
            }
        })()
    }, [])
    if (state.state === 'loading') {
        return <Spinner />
    }
    if (state.state === 'error') {
        return (
            <Box>
                <Typography variant="h6">Error loading URL</Typography>
                <Typography>{(state.err as Error).message}</Typography>
            </Box>
        )
    }
    const info = state.info
    return (
        <>
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
        </>
    )
}
