import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function Loader() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="inherit"
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
