import React from 'react'
import { Dialog, DialogTitle, TextField } from '@mui/material'

interface DestinationDialogProps {
    open: boolean
    onClose(): void
    onChoose(name: string): void
    title?: string
    extension?: string
}

export default function DestinationDialog({
    open,
    onClose,
    onChoose,
    title,
    extension,
}: DestinationDialogProps) {
    const ext = extension ? `.${extension}` : ''
    const suggestedName = `${title ?? 'no-title'}${ext}`
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Destination</DialogTitle>
            <TextField value={suggestedName}></TextField>
        </Dialog>
    )
}
