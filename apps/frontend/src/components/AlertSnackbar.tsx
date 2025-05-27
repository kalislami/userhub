'use client'

import { Snackbar, Alert, AlertColor } from '@mui/material';

interface AlertSnackbarProps {
    open: boolean;
    onClose: () => void;
    message: string;
    severity?: AlertColor;
    autoHideDuration?: number;
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
}

export default function AlertSnackbar({
    open,
    onClose,
    message,
    severity = 'success',
    autoHideDuration = 5000,
    vertical = 'top',
    horizontal = 'center',
}: AlertSnackbarProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical, horizontal }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
}
