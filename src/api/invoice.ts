import type { TablePaginationConfig } from 'antd';

import { axiosInstance } from './request';

export const getInvoice = async (pagination?: TablePaginationConfig, filter?: string, sort?: string, filterQueryBox?: string) => {
  return axiosInstance
    .get(
      `/admin/commission/invoice/list?page=${pagination?.current || 1}&size=${pagination?.pageSize || 10}${
        filter ? filter : ''
      }&${sort}&${filterQueryBox}`,
    )
    .then(data => data)
    .catch(err => {
      throw err;
    });
};

export const getInvoiceDetail = async (id: any) => {
  return axiosInstance
    .get('/admin/commission/invoice/detail/' + id)
    .then(data => data)
    .catch(err => {
      throw err;
    });
};

export const approveInvoice = async (id: any) => {
  return axiosInstance
    .post('/admin/commission/invoice/approve/' + id)
    .then(data => data)
    .catch(err => {
      throw err;
    });
};

export const createInvoice = async (period: any) => {
  return axiosInstance
    .post('/admin/commission/invoice/create/', {
      period: period,
    })
    .then(data => data)
    .catch(err => {
      throw err;
    });
};
