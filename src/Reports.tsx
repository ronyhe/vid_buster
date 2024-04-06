import React, { useEffect } from 'react'
import { SingleStatusReport } from './messages'
import { getReports } from './client'
import { Box, Divider, List, Typography } from '@mui/material'

export default function Reports() {
    const [reports, setReports] = React.useState<SingleStatusReport[] | null>(
        null,
    )
    useEffect(() => {
        const interval = setInterval(() => {
            getReports().then(setReports)
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <List>
            {reports?.map((r) => (
                <Box>
                    <Typography key={r.title} variant="body1">
                        {shortTitle(r.title)} - {r.status}
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
