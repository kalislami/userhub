import EmotionRegistry from '@/components/EmotionRegistry';
import { Providers } from '@/app/provider';
import '@/styles/global.css';

export const metadata = {
  title: 'Userhub Web App',
  description: '...',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EmotionRegistry>
          <Providers>{children}</Providers>
        </EmotionRegistry>
      </body>
    </html>
  );
}
