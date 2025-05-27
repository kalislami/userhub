'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { RootState } from '@/store'
import { getAllUsers } from '@/apis/userApi'
import { UserCard } from '@/components/UserCard'
import { User } from '@shared/types/user'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[] | []>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const fetchUsers = useCallback(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    getAllUsers(token)
      .then(data => setUsers(data))
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIsCheckingAuth(false));

  }, [token, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isCheckingAuth) {
    return (
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
    )
  }

  return (
    <Container sx={{ py: 4, minHeight: 'calc(100vh - 132px)' }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign={{ xs: 'center', md: 'left' }}>
        User List
      </Typography>

      <Grid container spacing={3}>
        {users.map((user: User) => (
          <Grid key={user.uid} size={{ xs: 12, sm: 4, md: 3 }}>
            <UserCard user={user} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}