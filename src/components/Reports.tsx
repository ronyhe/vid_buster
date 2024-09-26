import React, { useEffect } from 'react'
import { Avatar, List, ListItem } from '@mui/material'
import DownloadingIcon from '@mui/icons-material/Downloading'
import ErrorIcon from '@mui/icons-material/ReportGmailerrorred'
import DoneIcon from '@mui/icons-material/Done'
import { TrackingReport } from '../messages'

// Some sort of bug, ListItem* components trigger a React error when imported from @mui/material
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

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
    const primary = shortTitle(report.title)
    const secondary = report.error ?? report.lastStatus
    return (
        <ListItem onClick={onDelete}>
            <ListItemAvatar>
                <Icon report={report} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
    )
}

function Icon({ report }: { report: TrackingReport }) {
    if (report.error) {
        return <ErrorIcon />
    }
    if (report.closed) {
        return <DoneIcon />
    }
    return <DownloadingIcon />
}

function shortTitle(title: string): string {
    return title.length > 20 ? title.slice(0, 20) + '...' : title
}
