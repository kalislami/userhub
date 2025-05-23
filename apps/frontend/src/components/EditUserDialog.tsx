'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { updateUser } from '@/apis/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { User } from '@shared/types/user';

export default function EditUserDialog({
    open,
    onClose,
    user,
    onUserd,
    fetchUsers,
}: {
    open: boolean;
    onClose: () => void;
    user: User | null;
    onUserd: (updatedUser: User) => void;
    fetchUsers: () => void;
}) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [ratings, setRatings] = useState(0);
    const [rents, setRents] = useState(0);
    const [saving, setSaving] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRatings(user.totalAverageWeightRatings);
            setRents(user.numberOfRents);
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (!token || user === null) {
                onClose();
                return;
            }

            const dataUpdate: User = {
                uid: user.uid,
                name,
                totalAverageWeightRatings: ratings,
                numberOfRents: rents
            }

            await updateUser(token, user.uid, dataUpdate);
            onUserd(dataUpdate);
            onClose();
            fetchUsers();
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
                dispatch(logout());
                localStorage.removeItem('token');
                router.push('/login');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Total Average Weight Ratings"
                    type="number"
                    fullWidth
                    value={ratings}
                    onChange={(e) => setRatings(Number(e.target.value))}
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Number of Rents"
                    type="number"
                    fullWidth
                    value={rents}
                    onChange={(e) => setRents(Number(e.target.value))}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : 'Simpan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}