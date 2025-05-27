'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, Typography, Button, Box, AlertColor } from '@mui/material'
import { logout } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { getUserById } from '@/apis/userApi'
import { User } from '@shared/types/user'
import { userLogout } from '@/lib/firebase'
import Link from 'next/link'
import AlertSnackbar from '@/components/AlertSnackbar'

export default function Header() {
  const { token, uid } = useSelector((state: RootState) => state.auth);
  const [logoutButton, setLogoutButton] = useState(false);
  const [user, setUser] = useState<User>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AlertColor>('success');

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    if (!uid) return;
    userLogout(uid);
    dispatch(logout());
    setLogoutButton(false);
    setOpenSnackbar(true);
    setAlertMessage('Logout success');
    setAlertType('success');
    router.push('/login')
  }

  useEffect(() => {
    const fetchWithRetry = async (attempt = 1) => {
      if (!token || !uid) return;
      try {
        const data = await getUserById(token, uid);
        setUser(data);
        setLogoutButton(true);
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          (error as { status: number }).status === 404 &&
          attempt <= 3
        ) {
          setTimeout(() => fetchWithRetry(attempt + 1), attempt * 300);
        }
      }
    };
    fetchWithRetry();
  }, [token, uid]);

  const goToSettings = () => {
    router.push('/settings');
  };

  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="h1" fontWeight="bold">
            UserHub
          </Typography>
        </Link>

        {logoutButton && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" component="h1" fontWeight="bold">
              Hello {user.name ?? ''}!
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={goToSettings}
              sx={{
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Settings
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>

      <AlertSnackbar
        open={openSnackbar}
        message={alertMessage}
        onClose={() => setOpenSnackbar(false)}
        severity={alertType}
      />
    </AppBar>
  )
}
