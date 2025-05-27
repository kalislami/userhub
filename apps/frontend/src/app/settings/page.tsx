'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { getUserById, updateUser } from '@/apis/userApi';
import { User } from '@shared/types/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { token, uid } = useSelector((state: RootState) => state.auth);
    const [profile, setProfile] = useState<User>({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const router = useRouter();
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token || !uid) {
                setLoading(false);
                router.push('/login');
                return;
            }

            const data = await getUserById(token, uid);
            setProfile(data);
            setLoading(false);
        };

        fetchProfile();
    }, [token, uid, router]);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            if (token && uid) {
                await updateUser(token, uid, profile);
                setOpenSnackbar(true)
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
                    Profile updated successfully!
                </Alert>
            </Snackbar>

            <Card>
                <CardContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Email"
                            value={profile?.email ?? ''}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Nama"
                            value={profile.name ?? ''}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Rata-rata Rating"
                            value={profile?.totalAverageWeightRatings ?? 0}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Jumlah Sewa"
                            value={profile?.numberOfRents ?? 0}
                            disabled
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            onClick={handleUpdate}
                            disabled={updating}
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
