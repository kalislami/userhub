'use client'

import { Box, Typography, Container } from '@mui/material'
import { useEffect, useState } from 'react'

export default function Footer() {
    const [year, setYear] = useState(2025)

    useEffect(() => {
        setYear(new Date().getFullYear())
    }, [])

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                textAlign: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body2" color="text.secondary">
                    © {year ?? '2025'} UserHub. All rights reserved.
                </Typography>
            </Container>
        </Box>
    )
}