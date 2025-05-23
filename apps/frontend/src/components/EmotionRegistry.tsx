'use client';

import { CacheProvider } from '@emotion/react';
import { emotionCache } from '@/lib/emotion-cache';

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
    return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}