'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { logout } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { useEffect, useState } from 'react'

export default function Header() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [logoutButton, setLogoutButton] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    router.push('/login')
  }

  useEffect(() => {
    const activeToken = token ?? localStorage.getItem('token');
    if (activeToken) {
      setLogoutButton(true);
    }
  }, [token]);

  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="h1" fontWeight="bold">
          UserHub
        </Typography>

        {logoutButton && <Button
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
        </Button>}
      </Toolbar>
    </AppBar>
  )
}
