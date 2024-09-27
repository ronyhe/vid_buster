import React, { useEffect } from 'react'
import {
    Box,
    IconButton,
    LinearProgress,
    LinearProgressProps,
    List,
    ListItem,
    Typography
} from '@mui/material'
import DownloadingIcon from '@mui/icons-material/Downloading'
import ErrorIcon from '@mui/icons-material/ReportGmailerrorred'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/CancelRounded'
import { TrackingReport } from '../messages'

// Some sort of bug, ListItem* components trigger a React error when imported from @mui/material
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

export interface ReportsProps {
    onDelete: (id: number) => void
    getReports: () => Promise<TrackingReport[]>
}

interface Progress {
    percent: number
    total: string
    speed: string
    eta: string
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
    return (
        <ListItem
            onClick={onDelete}
            secondaryAction={
                <IconButton edge={'end'}>
                    <CloseIcon fontSize={'small'} />
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Icon report={report} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary(report)} />
        </ListItem>
    )
}

function secondary(report: TrackingReport) {
    const { error, closed } = report
    if (error) {
        return (
            <Typography variant={'caption'} color={'error'}>
                {error}
            </Typography>
        )
    }
    if (closed) {
        return (
            <LinearProgressWithLabel
                variant='determinate'
                value={100}
                color={'success'}
            />
        )
    }
    const progress = getProgress(report)
    if (progress) {
        return (
            <>
                <LinearProgressWithLabel
                    variant='determinate'
                    value={progress.percent}
                />
                <Typography
                    variant={'caption'}
                    color={'text.secondary'}
                >{`ETA: ${progress.eta}. Downloading ${progress.total} at ${progress.speed}`}</Typography>
            </>
        )
    }
    return <LinearProgress />
}

function Icon({ report: { error, closed } }: { report: TrackingReport }) {
    if (error) {
        return <ErrorIcon color={'error'} />
    }
    if (closed) {
        return <DoneIcon color={'success'} />
    }
    return <DownloadingIcon />
}

function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
) {
    // https://mui.com/material-ui/react-progress/#linear-with-label
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant='determinate' {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant='body2'
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    )
}

function shortTitle(title: string): string {
    const length = 40
    return title.length > length ? title.slice(0, length) + '...' : title
}

function getProgress({ lastStatus }: TrackingReport): Progress | null {
    // 0.5% of  104.29MiB at   10.86MiB/s ETA 00:09
    const regex = /(\S+)%\s+of\s+(\S+)\s+at\s+(\S+)\sETA\s(\S+)/
    const match = regex.exec(lastStatus)
    if (!match) {
        return null
    }
    const [_, percent, total, speed, eta] = match
    return {
        percent: parseFloat(percent),
        total,
        speed,
        eta
    }
}
