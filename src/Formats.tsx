import React, { useEffect } from 'react'
import { UrlInfo } from './messages'
import { downloadFormat, getUrlInfo, inspectedPageUrl } from './client'
import { Box, Button, Divider, List, ListItem, Typography } from '@mui/material'

interface FormatsProps {
    onChoose(): void
}

interface FormatsState extends UrlInfo {
    url: string
}

async function init(): Promise<FormatsState> {
    const url = await inspectedPageUrl()
    const info = await getUrlInfo(url)
    return { ...info, url }
}

export default function Formats({ onChoose }: FormatsProps) {
    const [info, setInfo] = React.useState<FormatsState | null>(null)
    useEffect(() => {
        init().then(setInfo)
    }, [])
    if (info === null) {
        return <Typography variant="subtitle1">Loading...</Typography>
    }
    return (
        <Box>
            <Typography variant="h6">{info.title}</Typography>
            <List>
                {info.formats.map((f) => (
                    <Box>
                        <ListItem key={f.id}>
                            <Button
                                onClick={() => {
                                    downloadFormat(info.url, f.id)
                                    onChoose()
                                }}
                            >
                                {f.resolution} - {f.size} .{f.extension}{' '}
                                {f.note && `(${f.note})`}
                            </Button>
                        </ListItem>
                        <Divider />
                    </Box>
                ))}
            </List>
        </Box>
    )
}
