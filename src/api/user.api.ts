import type { LoginParams, LoginResult, LogoutParams, LogoutResult } from '../interface/user/login';

import { axiosInstance, request } from './request';

export const apiLogin = (data: LoginParams) => request<LoginResult>('post', '/admin/login', data);

export const apiLogout = (data: LogoutParams) => request<LogoutResult>('post', '/admin/logout', data);
export const adminGetUser = (email: string) =>{
    return axiosInstance.get<any>(`/admin/customer/find/${email}`)
}