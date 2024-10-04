import React, { useEffect, useState } from 'react'
import { List } from '@mui/material'
import { TrackingReport } from '../messages'
import { Report } from './Report'

export interface ReportsProps {
    onDelete: (id: number) => void
    getReports: () => Promise<TrackingReport[]>
    interval: number // An interval of 0 means no polling, show the reports once. Useful for testing.
}

export function Reports({ onDelete, getReports, interval }: ReportsProps) {
    const [reports, setReports] = useState<TrackingReport[] | null>(null)
    useEffect(() => {
        if (interval !== 0) {
            const handle = setInterval(async () => {
                const reports = await getReports()
                setReports(reports)
            }, interval)
            return () => clearInterval(handle)
        } else {
            getReports().then(reports => setReports(reports))
        }
    }, [])

    return (
        <List>
            {reports?.map(r => (
                <Report key={r.id} report={r} onDelete={() => onDelete(r.id)} />
            ))}
        </List>
    )
}
