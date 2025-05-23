import { Box, Typography, Container } from '@mui/material'

export default function Footer() {
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
                    © {new Date().getFullYear()} UserHub. All rights reserved.
                </Typography>
            </Container>
        </Box>
    )
}