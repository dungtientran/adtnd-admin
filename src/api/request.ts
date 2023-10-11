import type { AxiosRequestConfig, Method } from 'axios';

import { message as $message } from 'antd';
import axios from 'axios';

import { INVALID_ACCESS_TOKEN, TOKEN_EXPIRED_MESSAGE } from '@/constant';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
// import { history } from '@/routes/history';

export const axiosInstance = axios.create({
  // timeout: 6000,
  baseURL: 'https://yys2edw6d6.execute-api.ap-southeast-1.amazonaws.com/dev',
});

axiosInstance.interceptors.request.use(
  config => {
    // store.dispatch(
    //   setGlobalState({
    //     loading: true,
    //   }),
    // );
    const token =
      config.url == '/admin/refresh_token' ? localStorage.getItem('rf-token') : localStorage.getItem('token');

    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };

    return config;
  },
  error => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );

    if (config?.data?.message) {
      // $message.success(config.data.message)
    }

    return config?.data;
  },
  async error => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );

    if (error.response?.data.message == TOKEN_EXPIRED_MESSAGE) {
      try {
        console.log('use refresh token');
        const res = await axiosInstance.post('/admin/refresh_token');
        const token = res.data.token.AccessToken;

        localStorage.setItem('token', token);
        const retrying_request = await axiosInstance(error.config);

        return retrying_request;
      } catch (error: any) {
        console.log('rf token error: ' + error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('rftoken');
        window.location.href = '/login';
      }
    } else if (error.response?.data.message == INVALID_ACCESS_TOKEN) {
      console.log(1122, error);
      localStorage.removeItem('token');
      localStorage.removeItem('rftoken');
      window.location.href = '/login';
    } else {
      throw new Error(error.response?.data.message || error.message || error.response?.data);
    }
  },
);

export type Response<T = any> = {
  [x: string]: any;
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  // const prefix = '/api'
  const prefix = '';

  url = prefix + url;

  if (method === 'post') {
    return axiosInstance.post(url, data, config);
  } else if (method === 'put') {
    return axiosInstance.post(url, data, config);
  } else {
    return axiosInstance.get(url, {
      params: data,
      ...config,
    });
  }
};
