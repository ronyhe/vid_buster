import React, { useCallback } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { Reports } from './Reports'
import { UrlDisplay } from './UrlDisplay'
import { downloadFormat } from '../serverFacade'
import { CustomUrl } from './CustomUrl'
import { Settings } from './Settings'
import { ResponseUrlInfoMessage, TrackingReport } from '../messages'
import { ValueOf } from '../utils'

interface AppProps {
    url: string
    getSettings(): Promise<Settings>
    updateSettings(settings: Settings): Promise<void>
    getUrlInfo(url: string): Promise<ResponseUrlInfoMessage>
    getReports(): Promise<TrackingReport[]>
    deleteReport(id: number): Promise<void>
}

const TabNames = {
    Here: 'Here',
    Downloads: 'Downloads',
    Url: 'Url',
    Settings: 'Settings'
}
type TabName = ValueOf<typeof TabNames>

export function App({
    url,
    getSettings,
    updateSettings,
    getUrlInfo,
    getReports,
    deleteReport
}: AppProps) {
    const [tabValue, setTabValue] = React.useState<TabName>(TabNames.Here)

    const handleChange = useCallback(
        (_: React.SyntheticEvent, newValue: TabName) => {
            setTabValue(newValue)
        },
        []
    )

    const getDownloadDestination = async () => {
        const settings = await getSettings()
        return settings.downloadDirectory
    }

    const tabs = (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange}>
                <Tab label='Here' value={TabNames.Here} />
                <Tab label='Downloads' value={TabNames.Downloads} />
                <Tab label='Url' value={TabNames.Url} />
                <Tab label={'Settings'} value={TabNames.Settings} />
            </Tabs>
        </Box>
    )

    const content = (() => {
        if (tabValue === TabNames.Here) {
            return (
                <UrlDisplay
                    load={() => getUrlInfo(url)}
                    onChoose={async (f, filename) => {
                        setTabValue(TabNames.Downloads)
                        await downloadFormat(
                            url,
                            f.id,
                            filename,
                            await getDownloadDestination()
                        )
                    }}
                />
            )
        }
        if (tabValue === TabNames.Downloads) {
            return <Reports onDelete={deleteReport} getReports={getReports} />
        }
        if (tabValue === TabNames.Url) {
            return (
                <CustomUrl
                    getUrlInfo={getUrlInfo}
                    onChoose={async (url, f, filename) => {
                        setTabValue(TabNames.Downloads)
                        await downloadFormat(
                            url,
                            f.id,
                            filename,
                            await getDownloadDestination()
                        )
                    }}
                />
            )
        }
        if (tabValue === TabNames.Settings) {
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
