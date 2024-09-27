import {
    Box,
    IconButton,
    LinearProgress,
    LinearProgressProps,
    ListItem,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/CancelRounded'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { TrackingReport } from '../messages'
import ErrorIcon from '@mui/icons-material/ReportGmailerrorred'
import DoneIcon from '@mui/icons-material/Done'
import DownloadingIcon from '@mui/icons-material/Downloading'
import React from 'react'

interface ReportProps {
    report: TrackingReport
    onDelete: () => void
}

interface Progress {
    percent: number
    total: string
    speed: string
    eta: string
}

export function Report({ report, onDelete }: ReportProps) {
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
            <ListItemText
                primary={primary}
                secondary={<ListItemSecondaryText report={report} />}
            />
        </ListItem>
    )
}

function ListItemSecondaryText({ report }: { report: TrackingReport }) {
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
        const { percent, speed, total, eta } = progress
        return (
            <>
                <LinearProgressWithLabel
                    variant='determinate'
                    value={percent}
                />
                <Typography
                    variant={'caption'}
                    color={'text.secondary'}
                >{`ETA: ${eta}. Downloading ${total} at ${speed}`}</Typography>
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

// https://mui.com/material-ui/react-progress/#linear-with-label
function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
) {
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
