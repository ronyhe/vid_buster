import React, { useEffect } from 'react'
import { SingleStatusReport } from './messages'
import { getReports } from './client'
import { Typography } from '@mui/material'

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
        <Typography variant="body1">
            {reports?.map((r) => (
                <div key={r.title}>
                    {shortTitle(r.title)} - {r.status}
                </div>
            ))}
        </Typography>
    )
}

function shortTitle(title: string): string {
    return title.length > 20 ? title.slice(0, 20) + '...' : title
}
