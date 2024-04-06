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
                    {r.title} - {r.status}
                </div>
            ))}
        </Typography>
    )
}

// /s ETA Unknown (frag 5/254)
// [download]   2.5% of ~  69.02MiB at    2.60MiB/s ETA Unknown (frag 5/254)
// [download] 100% of   94.15MiB in 00:00:12 at 7.38MiB/s
