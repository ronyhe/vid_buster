import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'

interface DestinationDialogProps {
    open: boolean
    // null means the user cancelled the dialog
    onClose(name: null | string): void
    title?: string
    extension?: string
}

export default function DestinationDialog({
    open,
    onClose,
    title,
    extension,
}: DestinationDialogProps) {
    const ext = extension ? `.${extension}` : ''
    const suggestedName = `${escapeFilename(title ?? 'no-title')}${ext}`
    const [value, setValue] = React.useState<string | null>(null)
    return (
        <Dialog open={open}>
            <DialogTitle>Download Destination</DialogTitle>
            <DialogContent>
                <TextField
                    defaultValue={suggestedName}
                    autoFocus={true}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    sx={{ width: '400px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)}>Cancel</Button>
                <Button onClick={() => onClose(value ?? suggestedName)}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function escapeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9_-]/g, '_')
}
