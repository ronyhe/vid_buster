import React, { useCallback } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import Reports from './Reports'
import UrlDisplay from './UrlDisplay'
import { getUrlInfo } from './client'

interface AppProps {
    url: string
}

export default function App({ url }: AppProps) {
    const [tabValue, setTabValue] = React.useState(0)

    const handleChange = useCallback(
        (_: React.SyntheticEvent, newValue: number) => {
            setTabValue(newValue)
        },
        [],
    )

    const tabs = (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange}>
                <Tab label="Here" />
                <Tab label="Downloads" />
                <Tab label="Url" />
            </Tabs>
        </Box>
    )

    const content = (() => {
        if (tabValue === 0) {
            return (
                <UrlDisplay
                    load={() => getUrlInfo(url)}
                    onChoose={() => setTabValue(1)}
                />
            )
        }
        if (tabValue === 1) {
            return <Reports />
        }
        return null
    })()

    return (
        <Box>
            <Box sx={{ width: '100%', height: '100%' }}>
                {tabs}
                {content}
            </Box>
        </Box>
    )
}
