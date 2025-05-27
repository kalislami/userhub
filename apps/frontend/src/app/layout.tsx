import '@/styles/global.css';
import { Providers } from '@/theme/provider';
import Main from '@/theme/Main';
import EmotionRegistry from '@/components/EmotionRegistry';

export const metadata = {
  title: 'Userhub Web App',
  description: 'User data management',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <EmotionRegistry>
            <Main>{children}</Main>
          </EmotionRegistry>
        </Providers>
      </body>
    </html>
  );
}
