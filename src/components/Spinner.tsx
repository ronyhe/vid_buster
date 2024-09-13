import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export function Spinner() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="inherit"
            padding={2}
        >
            <CircularProgress
                sx={{
                    position: 'relative',
                    top: '40%',
                }}
            />
        </Box>
    )
}
