import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
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
    const suggestedName = `${title ?? 'no-title'}${ext}`
    const [value, setValue] = React.useState(suggestedName)
    return (
        <Dialog open={open}>
            <DialogTitle>Download Destination</DialogTitle>
            <TextField
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
            ></TextField>
            <DialogActions>
                <Button onClick={() => onClose(null)}>Cancel</Button>
                <Button onClick={() => onClose(value)}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}
