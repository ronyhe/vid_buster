import React from 'react'
import { Card, CardContent, Box } from '@mui/material'
import { TrackingReport } from '../messages'
import { Report } from './Report'
import { Loader } from './Loader'

export interface ReportsProps {
    onDelete: (id: number) => void
    getReports: () => Promise<TrackingReport[]>
    interval: number
}

export function Reports({ onDelete, getReports, interval }: ReportsProps) {
    return (
        <Loader
            getData={getReports}
            createContent={reports =>
                reports.length ? (
                    reports.map(r => (
                        <Report
                            key={r.id}
                            report={r}
                            onDelete={() => onDelete(r.id)}
                        />
                    ))
                ) : (
                    <Empty />
                )
            }
            createError={err => <div>{err.message}</div>}
            interval={interval}
        />
    )
}

function Empty() {
    return (
        <Box>
            <Card>
                <CardContent>No Reports</CardContent>
            </Card>
        </Box>
    )
}
