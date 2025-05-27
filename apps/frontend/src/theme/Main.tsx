'use client';

import { CircularProgress, Container, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { connectAuthEmulator, getIdToken, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import Footer from '@/theme/Footer';
import Header from '@/theme/Header';
import { auth, setUserPresence } from '@/lib/firebase';
import { loginSuccess } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';

export default function Main({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

    useEffect(() => {
        if (USE_EMULATOR) {
            connectAuthEmulator(auth, 'http://localhost:9099');
            console.log('[Firebase] connected to Auth emulator');
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await getIdToken(user);
                setUserPresence({ uid: user.uid, token });
                dispatch(loginSuccess({ token, uid: user.uid }));
            }
            setLoading(false)
        });

        return () => unsubscribe();
    }, [dispatch, router, USE_EMULATOR]);

    return (
        <>
            <Header />
            <Container sx={{ py: 4, minHeight: 'calc(100vh - 132px)' }}>
                {loading ?
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="60vh"
                    >
                        <CircularProgress color='primary' size={40} />
                        <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }} fontSize={40}>
                            Loading...
                        </Typography>
                    </Box>
                    : children}
            </Container>
            <Footer />
        </>
    );
}
