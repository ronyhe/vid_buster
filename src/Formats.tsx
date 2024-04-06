import React, { useEffect } from 'react'
import { UrlInfo } from './messages'
import { getUrlInfo } from './client'
import { Box, Button, Divider, List, ListItem, Typography } from '@mui/material'

export default function Formats() {
    const [info, setInfo] = React.useState<UrlInfo | null>(null)
    useEffect(() => {
        getUrlInfo().then((info) => {
            setInfo(info)
        })
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
                            <Button>
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
