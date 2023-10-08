import type { Role } from '@/interface/user/login';
import type { Locale, UserState } from '@/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import { json } from 'stream/consumers';

import { getGlobalState } from '@/utils/getGloabal';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem('logged') ? true : false,
  menuList: [],
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  role: (localStorage.getItem('username') || '') as Role,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
    loginSuccess(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state.user, action.payload.user);
      state.logged = action.payload.logged ? true : false;
    },
    logout(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state.user, {});
      state.logged = false;
    },
  },
});

export const { setUserItem, loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
