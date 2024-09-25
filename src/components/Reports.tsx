import React, { useEffect } from 'react'
import { getReports } from '../serverFacade'
import { Box, Divider, List, Typography } from '@mui/material'
import { TrackingReport } from '../messages'

export function Reports() {
    const [reports, setReports] = React.useState<TrackingReport[] | null>(null)
    useEffect(() => {
        const interval = setInterval(async () => {
            const reports = await getReports()
            setReports(reports)
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <List>
            {reports?.map(r => (
                <Box key={r.title}>
                    <Typography variant='body1'>
                        {shortTitle(r.title)} - {r.error ?? r.lastStatus}
                    </Typography>
                    <Divider />
                </Box>
            ))}
        </List>
    )
}

function shortTitle(title: string): string {
    return title.length > 20 ? title.slice(0, 20) + '...' : title
}
