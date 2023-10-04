import type { MenuList } from '../interface/layout/menu.interface';
import type { Notice } from '@/interface/layout/notice.interface';
import type { AxiosRequestConfig } from 'axios';

import { request } from './request';

export const getMenuList = (config: AxiosRequestConfig = {}) => request<MenuList>('get', '/user/menu', {}, config);

export const getNoticeList = (config: AxiosRequestConfig = {}) => request<Notice[]>('get', '/kaak', {}, config);
