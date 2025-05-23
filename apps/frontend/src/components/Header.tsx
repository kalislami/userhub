'use client'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { logout } from '@/store/slices/authSlice'

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="h1" fontWeight="bold">
          UserHub
        </Typography>

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
      </Toolbar>
    </AppBar>
  )
}
