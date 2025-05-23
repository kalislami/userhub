import { User } from '@shared/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsersStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess(state, action: PayloadAction<User[]>) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchUsersFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserSuccess(state, action: PayloadAction<User>) {
            const index = state.users.findIndex(u => u.uid === action.payload.uid);
            if (index !== -1) state.users[index] = action.payload;
        },
    },
});

export const {
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
    updateUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
