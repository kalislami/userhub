'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { AppDispatch, RootState } from '@/store'
import { createRandomUser, getAllUsers } from '@/apis/userApi'
import { UserCard } from '@/components/UserCard'
import { useRouter } from 'next/navigation'
import { loginSuccess, logout } from '@/store/slices/authSlice'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EditUserDialog from '@/components/EditUserDialog'
import { User } from '@shared/types/user'

export default function HomePage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [users, setUsers] = useState<User[] | []>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setEditUser(null);
    setOpenEdit(false);
  };

  const handleCreateUser = async () => {
    setCreating(true);

    if (!token) {
      setCreating(false);
      router.push('/login');
      return;
    }

    try {
      await createRandomUser(token);
      fetchUsers();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
        dispatch(logout());
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setCreating(false);
    }
  }

  const fetchUsers = useCallback(() => {
    if (!token) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        dispatch(loginSuccess(savedToken));
      } else {
        router.push('/login');
        return;
      }
    } else {
      getAllUsers(token)
        .then(data => setUsers(data))
        .catch(err => {
          if (err.status === 401) {
            dispatch(logout());
            localStorage.removeItem('token');
            router.push('/login');
          }
        })
        .finally(() => setIsCheckingAuth(false));
    }
  }, [token, dispatch, router]);

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
    <>
      <Header />
      <Container sx={{ py: 4, minHeight: 'calc(100vh - 132px)' }}>
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign={{ xs: 'center', md: 'left' }}>
          User List
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={() => handleCreateUser()}
          disabled={creating}
        >
          {creating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create New User'}
        </Button>

        <Grid container spacing={3}>
          {users.map((user: User) => (
            <Grid key={user.uid} size={{ xs: 12, sm: 4, md: 3 }}>
              <UserCard user={user} onEdit={handleOpenEdit} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <EditUserDialog
        fetchUsers={fetchUsers}
        open={openEdit}
        onClose={handleCloseEdit}
        user={editUser}
        onUserd={(updatedUser) => {
          setUsers((prev) =>
            prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u))
          );
        }}
      />
      <Footer />
    </>
  )
}