import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { Loader } from './Loader'

export interface Settings {
    defaultDownloadPath: string
}

export interface SettingsProps {
    updateSettings(settings: Settings): Promise<void>
    getSettings(): Promise<Partial<Settings>>
}

export function Settings({ getSettings }: SettingsProps) {
    return (
        <Loader
            getData={getSettings}
            createContent={({ defaultDownloadPath }) => (
                <Box sx={{ padding: '5px' }}>
                    <TextField
                        variant="standard"
                        label="Default download path"
                        defaultValue={defaultDownloadPath ?? '~/Downloads'}
                        InputProps={{
                            endAdornment: <Button variant="text">Save</Button>,
                        }}
                        sx={{
                            width: '40%',
                        }}
                    />
                </Box>
            )}
            createError={() => <div>Error loading settings</div>}
        />
    )
}
