import '@/styles/global.css';
import Main from '@/theme/Main';

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
        <Main>{children}</Main>
      </body>
    </html>
  );
}
