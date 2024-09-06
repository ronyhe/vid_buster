import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { Loader } from './Loader'

export interface Settings {
    defaultDownloadPath: string
}

export interface SettingsProps {
    updateSettings(settings: Settings): Promise<void>
    getSettings(): Promise<Settings>
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
    const [path, setPath] = useState(defaultDownloadPath)
    const [error, setError] = useState<string | null>(null)
    const save = async () => {
        try {
            await updateSettings({
                defaultDownloadPath: path,
            })
        } catch (e) {
            setError((e as Error).message)
        }
    }
    if (error) {
        return <div>{error}</div>
    }
    return (
        <Box sx={{ padding: '5px' }}>
            <TextField
                onKeyUp={async (e) => {
                    if (e.key === 'Enter') {
                        await save()
                    }
                }}
                variant="standard"
                label="Default download path"
                defaultValue={defaultDownloadPath ?? '~/Downloads'}
                onChange={(e) => {
                    setPath(e.target.value)
                }}
                InputProps={{
                    endAdornment: (
                        <Button variant="text" onClick={save}>
                            Save
                        </Button>
                    ),
                }}
                autoFocus={true}
                sx={{
                    width: '40%',
                }}
            />
        </Box>
    )
}
