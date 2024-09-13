import React from 'react'
import { Box, Button, Divider, List, ListItem, Typography } from '@mui/material'
import { Format, UrlInfo } from '../messages'

export interface FormatListProps {
    onChoose(format: Format): void
    info: UrlInfo
}

export function FormatList({ onChoose, info }: FormatListProps) {
    return (
        <Box>
            <Typography variant="h6">{info.title}</Typography>
            <List>
                {info.formats.map((f) => (
                    <Box key={f.id}>
                        <ListItem>
                            <Button
                                onClick={() => {
                                    onChoose(f)
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
