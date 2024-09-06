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

export function DestinationDialog({
    open,
    onClose,
    title,
    extension,
}: DestinationDialogProps) {
    const ext = extension ? `.${extension}` : ''
    const suggestedName = `${escapeFilename(title ?? 'no-title')}${ext}`
    const [value, setValue] = React.useState<string | null>(null)
    return (
        <Dialog
            open={open}
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    onClose(value ?? suggestedName)
                }
            }}
            onClose={() => {
                // According to the types, the reasons are only 'escapeKeyDown' and 'backdropClick'
                onClose(null)
            }}
        >
            <DialogTitle>Download Destination</DialogTitle>
            <DialogContent>
                <TextField
                    variant="standard"
                    defaultValue={suggestedName}
                    autoFocus={true}
                    onFocus={(event) => {
                        event.preventDefault()
                        const { target } = event
                        const extensionStarts = target.value.lastIndexOf('.')
                        target.focus()
                        target.setSelectionRange(0, extensionStarts)
                    }}
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
