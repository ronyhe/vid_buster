import React, { useEffect } from 'react'
import { UrlInfo } from '../messages'
import { downloadFormat, getUrlInfo } from './client'
import { Snackbar } from '@mui/material'
import Loader from './Loader'
import FormatList from './FormatList'

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

export default function Here({ onChoose, url }: FormatsProps) {
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
        <FormatList
            onChoose={(f) => {
                downloadFormat(url, f.id)
                onChoose()
            }}
            info={info}
        />
    )
}
