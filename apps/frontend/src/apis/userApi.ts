import axios from 'axios';
import { User } from '@shared/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const getAllUsers = async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getUserById = async (token: string, id: string) => {
    const response = await axios.get(`${API_BASE_URL}/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const updateUser = async (token: string, uid: string, data: User) => {
    await axios.put(`${API_BASE_URL}/user/${uid}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};