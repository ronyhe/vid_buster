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

interface InternalProps {
    settings: Settings
    updateSettings(settings: Settings): Promise<void>
}

export function Settings({ getSettings, updateSettings }: SettingsProps) {
    return (
        <Loader
            getData={getSettings}
            createContent={(settings) => (
                <Internal settings={settings} updateSettings={updateSettings} />
            )}
            createError={() => <div>Error loading settings</div>}
        />
    )
}

function Internal({
    settings: { defaultDownloadPath },
    updateSettings,
}: InternalProps) {
    const [path, setPath] = React.useState(defaultDownloadPath)
    return (
        <Box sx={{ padding: '5px' }}>
            <TextField
                variant="standard"
                label="Default download path"
                defaultValue={defaultDownloadPath ?? '~/Downloads'}
                onChange={(e) => {
                    setPath(e.target.value)
                }}
                InputProps={{
                    endAdornment: (
                        <Button
                            variant="text"
                            onClick={() => {
                                updateSettings({ defaultDownloadPath: path })
                            }}
                        >
                            Save
                        </Button>
                    ),
                }}
                sx={{
                    width: '40%',
                }}
            />
        </Box>
    )
}
