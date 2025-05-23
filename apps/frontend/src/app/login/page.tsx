'use client';

import { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { login } from '@/apis/userApi';
import { errorMsg } from '@/lib/error-handler';

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const handleLogin = async () => {
        dispatch(loginStart());

        try {
            const token = await login(email, password);
            dispatch(loginSuccess(token));
            localStorage.setItem('token', token);
            router.push('/');
        } catch (err: unknown) {
            const message = errorMsg(err, 'Login failed');
            dispatch(loginFailure(message));
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
            dispatch(loginSuccess(savedToken))
            router.push('/')
        } else {
            setIsCheckingAuth(false)
        }
    }, [router, dispatch])

    if (isCheckingAuth) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box
            component="form"
            onSubmit={e => {
                e.preventDefault();
                handleLogin();
            }}
            display="flex"
            flexDirection="column"
            maxWidth={400}
            mx="auto"
            mt={10}
            gap={2}
            padding={3}
            border="1px solid #ccc"
            borderRadius={2}
        >
            <Typography variant="h5">Login</Typography>
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

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
}
