import { axiosInstance } from '@/api/request';
import { createAction, createSlice, Dispatch, PrepareAction } from '@reduxjs/toolkit';

export interface SubscriptionState {
    subscriptions: any[];
}

const initialState: SubscriptionState = {
    subscriptions: []
};


export const subscriptionsSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSubscriptions: (state, action) => {
            state.subscriptions = action.payload.subscriptions || [];
        }
    },
    extraReducers: () => {

    },
});

export const { setSubscriptions } = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
