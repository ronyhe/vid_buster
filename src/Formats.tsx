import React, { useEffect } from 'react'
import { UrlInfo } from './messages'
import { downloadFormat, getUrlInfo, inspectedPageUrl } from './client'
import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    Snackbar,
    Typography,
} from '@mui/material'
import Loader from './Loader'

interface FormatsProps {
    onChoose(): void
}

interface FullUrlInfo extends UrlInfo {
    url: string
}

interface Success {
    state: 'success'
    info: FullUrlInfo
}

interface Error {
    state: 'error'
    message: string
}

interface Loading {
    state: 'loading'
}

type State = Success | Error | Loading

async function init(): Promise<FullUrlInfo> {
    const url = await inspectedPageUrl()
    const info = await getUrlInfo(url)
    return { ...info, url }
}

export default function Formats({ onChoose }: FormatsProps) {
    const [state, setState] = React.useState<State>({ state: 'loading' })
    useEffect(() => {
        init()
            .then((info) => setState({ state: 'success', info }))
            .catch((e) => setState({ state: 'error', message: e.message }))
    }, [])

    if (state.state === 'loading') {
        return <Loader />
    }
    if (state.state === 'error') {
        return (
            <Snackbar
                open={true}
                autoHideDuration={6000}
                message={state.message}
            />
        )
    }
    const { info } = state
    return (
        <Box>
            <Typography variant="h6">{info.title}</Typography>
            <List>
                {info.formats.map((f) => (
                    <Box>
                        <ListItem key={f.id}>
                            <Button
                                onClick={() => {
                                    downloadFormat(info.url, f.id)
                                    onChoose()
                                }}
                            >
                                {f.resolution} - {f.size} .{f.extension}{' '}
                                {f.note && `(${f.note})`}
                            </Button>
                        </ListItem>
                        <Divider />
                    </Box>
                ))}
            </List>
        </Box>
    )
}
