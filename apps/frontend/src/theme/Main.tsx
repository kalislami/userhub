'use client';

import EmotionRegistry from '@/components/EmotionRegistry';
import { Providers } from '@/theme/provider';
import Footer from '@/theme/Footer';
import Header from '@/theme/Header';
import { Container } from '@mui/material';

export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <EmotionRegistry>
            <Providers>
                <Header />
                <Container sx={{ py: 4, minHeight: 'calc(100vh - 132px)' }}>
                    {children}
                </Container>
                <Footer />
            </Providers>
        </EmotionRegistry>

    );
}
