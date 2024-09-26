import React, { useEffect } from 'react'
import { Divider, List, ListItem, Typography } from '@mui/material'
import { TrackingReport } from '../messages'

export interface ReportsProps {
    onDelete: (id: number) => void
    getReports: () => Promise<TrackingReport[]>
}

interface ReportProps {
    report: TrackingReport
    onDelete: () => void
}

export function Reports({ onDelete, getReports }: ReportsProps) {
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
                <Report key={r.id} report={r} onDelete={() => onDelete(r.id)} />
            ))}
        </List>
    )
}

function Report({ report, onDelete }: ReportProps) {
    return (
        <ListItem>
            <Typography variant='body1'>
                {shortTitle(report.title)} - {report.error ?? report.lastStatus}
            </Typography>
            <Divider />
        </ListItem>
    )
}

function shortTitle(title: string): string {
    return title.length > 20 ? title.slice(0, 20) + '...' : title
}
