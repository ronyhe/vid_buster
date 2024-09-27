import React, { useEffect, useState } from 'react'
import { List } from '@mui/material'
import { TrackingReport } from '../messages'
import { Report } from './Report'

export interface ReportsProps {
    onDelete: (id: number) => void
    getReports: () => Promise<TrackingReport[]>
}

export function Reports({ onDelete, getReports }: ReportsProps) {
    const [reports, setReports] = useState<TrackingReport[] | null>(null)
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
                <Report key={r.id} report={r} onDelete={() => onDelete(r.id)} />
            ))}
        </List>
    )
}
