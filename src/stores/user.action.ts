import { message } from 'antd';
import type { LoginParams } from '../interface/user/login';
import type { Dispatch } from '@reduxjs/toolkit';

import { apiLogin, apiLogout } from '../api/user.api';
import { setUserItem, loginSuccess, logout } from './user.store';
import { createAsyncAction } from './utils';
// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = async (payload: any) => {
    return async (dispatch: Dispatch) => {
        console.log(payload)
        try {
            const data = await apiLogin({
                email: payload.username,
                password: payload.password
            });

            if (data.code == 200 && data.force_change_password) {
                // xử lí đăng nhập lần đầu
            } else if (data.code == 200) {
                console.log('login ................ > ')
                localStorage.setItem('token', data.token.AccessToken);
                localStorage.setItem('rf-token', data.token.RefreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('logged', 'true');
                dispatch(
                    loginSuccess({
                        logged: true,
                        user: data.user,
                    }),
                );

                return {
                    success: true,
                    message: 'Đăng nhập thành công!'
                }
            }
        } catch (error: any) {

            return {
                success: false,
                message: error.message
            }
        }
    };
};

export const logoutAsync = () => {
    return async (dispatch: Dispatch) => {
        // const { status } = await apiLogout({ token: localStorage.getItem('t')! });
        console.log('logged out');
        localStorage.removeItem('token');
        localStorage.removeItem('rf-token');
        localStorage.removeItem('user');
        localStorage.removeItem('logged');
        dispatch(
            logout({}),
        );

        return true;

    };
};
