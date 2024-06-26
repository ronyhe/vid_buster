import React, { useCallback } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import Formats from './Formats'
import Reports from './Reports'

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

    return (
        <Box>
            <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChange}>
                        <Tab label="Here" />
                        <Tab label="Downloads" />
                    </Tabs>
                </Box>
                {tabValue === 0 ? (
                    <Formats onChoose={() => setTabValue(1)} url={url} />
                ) : (
                    <Reports />
                )}
            </Box>
        </Box>
    )
}
