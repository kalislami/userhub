'use client';

import { Card, CardContent, Typography, Box, Button, CardActions } from '@mui/material';
import { User } from '@shared/types/user';
import { useEffect, useState } from 'react';

export function UserCard({
    user,
    onEdit,
}: {
    user: User;
    onEdit: (user: User) => void;
}) {
    const [formattedDate, setFormattedDate] = useState('N/A');

    useEffect(() => {
        if (user.recentlyActive) {
            const date = new Date(
                user.recentlyActive < 1e12
                    ? user.recentlyActive * 1000
                    : user.recentlyActive
            );
            setFormattedDate(date.toLocaleDateString());
        }
    }, [user.recentlyActive]);

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                boxShadow: 2,
                transition: '0.3s',
                '&:hover': {
                    boxShadow: 4,
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {user.name}
                </Typography>

                <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        Total Average Weight Ratings:
                    </Typography>
                    <Typography variant="body1">
                        {user.totalAverageWeightRatings}
                    </Typography>
                </Box>

                <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        Number of Rents:
                    </Typography>
                    <Typography variant="body1">{user.numberOfRents}</Typography>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Recently Active:
                    </Typography>
                    <Typography variant="body1">
                        {formattedDate}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions>
                <Button size="small" onClick={() => onEdit(user)}>
                    Edit
                </Button>
            </CardActions>
        </Card>
    );
}