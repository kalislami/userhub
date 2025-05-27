'use client';

import { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, AlertColor } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { loginStart, loginFailure } from '@/store/slices/authSlice';
import { errorMsg } from '@/lib/error-handler';
import { userRegister } from '@/lib/firebase';
import AlertSnackbar from '@/components/AlertSnackbar';

export default function RegisterPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, token, uid } = useSelector((state: RootState) => state.auth);

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<AlertColor>('success');

    const router = useRouter();
    const handleRegister = async () => {
        if (password !== passwordConfirm) {
            setAlertMessage('password not match');
            setAlertType('error')
            setOpenSnackbar(true)
            return;
        }

        dispatch(loginStart());

        try {
            await userRegister(email, password, name);
            setAlertMessage('register success');
            setAlertType('success')
            setOpenSnackbar(true)
        } catch (err: unknown) {
            const message = errorMsg(err, 'Register failed');
            setAlertMessage(message);
            setAlertType('error')
            setOpenSnackbar(true)
            dispatch(loginFailure(message));
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (token && uid) router.push('/');
            else setIsCheckingAuth(false);
        };

        checkAuth();
    }, [router, token, uid])

    return (isCheckingAuth ?
        (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        ) :
        <Box
            component="form"
            onSubmit={e => {
                e.preventDefault();
                handleRegister();
            }}
            display="flex"
            flexDirection="column"
            maxWidth={400}
            mx="auto"
            mt={5}
            gap={2}
            padding={3}
            border="1px solid #ccc"
            borderRadius={2}
        >
            <Typography variant="h5">Register</Typography>
            <TextField
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="full name"
                fullWidth
            />
            <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email@email"
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                fullWidth
            />

            <TextField
                label="Confirm Password"
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                autoComplete="current-password"
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <AlertSnackbar
                open={openSnackbar}
                message={alertMessage}
                onClose={() => setOpenSnackbar(false)}
                severity={alertType}
            />
        </Box>
    );
}
