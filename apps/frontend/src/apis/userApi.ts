import { User } from '@shared/types/user';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

    if (!response.data.token) {
        throw Error('')
    }

    return response.data.token;
};

export const getAllUsers = async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/user`, {
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

export const createRandomUser = async (token: string) => {
    const dateNow = Date.now();
    await axios.post(`${API_BASE_URL}/user`, {
        name: `User-${dateNow}`,
        totalAverageWeightRatings: 4.8,
        numberOfRents: 10
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};