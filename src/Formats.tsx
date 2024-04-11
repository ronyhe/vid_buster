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
    url: string
}

interface Success {
    state: 'success'
    info: UrlInfo
}

interface Error {
    state: 'error'
    message: string
}

interface Loading {
    state: 'loading'
}

type State = Success | Error | Loading

export default function Formats({ onChoose, url }: FormatsProps) {
    const [state, setState] = React.useState<State>({ state: 'loading' })
    useEffect(() => {
        getUrlInfo(url)
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
                                    downloadFormat(url, f.id)
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
