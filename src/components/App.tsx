import React, { useCallback } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { Reports } from './Reports'
import { UrlDisplay } from './UrlDisplay'
import { downloadFormat } from '../client'
import { CustomUrl } from './CustomUrl'
import { Settings } from './Settings'
import { UrlInfo } from '../messages'

interface AppProps {
    url: string
    getSettings(): Promise<Settings>
    updateSettings(settings: Settings): Promise<void>
    getUrlInfo(url: string): Promise<UrlInfo>
}

export function App({
    url,
    getSettings,
    updateSettings,
    getUrlInfo,
}: AppProps) {
    const [tabValue, setTabValue] = React.useState(0)

    const handleChange = useCallback(
        (_: React.SyntheticEvent, newValue: number) => {
            setTabValue(newValue)
        },
        [],
    )

    const getDownloadDestination = async () => {
        const settings = await getSettings()
        return settings.downloadDirectory
    }

    const tabs = (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange}>
                <Tab label="Here" />
                <Tab label="Downloads" />
                <Tab label="Url" />
                <Tab label={'Settings'} />
            </Tabs>
        </Box>
    )

    const content = (() => {
        if (tabValue === 0) {
            return (
                <UrlDisplay
                    load={() => getUrlInfo(url)}
                    onChoose={async (f, filename) => {
                        setTabValue(1)
                        await downloadFormat(
                            url,
                            f.id,
                            filename,
                            await getDownloadDestination(),
                        )
                    }}
                />
            )
        }
        if (tabValue === 1) {
            return <Reports />
        }
        if (tabValue === 2) {
            return (
                <CustomUrl
                    getUrlInfo={getUrlInfo}
                    onChoose={async (f, filename) => {
                        setTabValue(1)
                        await downloadFormat(
                            f.url,
                            f.id,
                            filename,
                            await getDownloadDestination(),
                        )
                    }}
                />
            )
        }
        if (tabValue === 3) {
            return (
                <Settings
                    updateSettings={updateSettings}
                    getSettings={getSettings}
                />
            )
        }
        throw new Error('Invalid tab value')
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
