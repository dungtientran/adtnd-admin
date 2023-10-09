import type { TablePaginationConfig } from 'antd';

import { error } from 'console';

import { SignalModel } from '@/interface/signal';

import { AppStore } from './../stores/index';
import { axiosInstance } from './request';

export interface CreateSignalData {
  signal: {
    stock_id: string;
    target_buy_price: number;
    target_stop_loss: number;
    target_sell_price_1: number;
    target_sell_price_2: number;
    target_sell_price_3: number;
    is_long_term: boolean;
    description: string;
  };
  target?: {
    subscription_product_id: string | null;
    customer_id: string | null;
    group_id: string | null;
    is_send_all: boolean;
  };
}

export interface UpdateSignal {
  id: string;
  stock_id: string;
  target_buy_price: number;
  target_stop_loss: number;
  target_sell_price_1: number;
  target_sell_price_2: number;
  target_sell_price_3: number;
  is_long_term: boolean;
  description: string;
}

interface SendSignalNotification {
  title: string;
  description: string;
  signal_id: string;
  signal_ids?: Array<string>;
}

interface SendManySignal {
  signal_ids: Array<string>;
  signal_id?: string;
  target?: {
    subscription_product_id: string | null;
    customer_id: string | null;
    group_id: string | null;
    is_send_all: boolean;
  };
}
interface ApproveSignal {
  signal_ids: Array<string>;
  approve: boolean;
}

interface ClosedSignal {
  id: string;
  closed_price: number;
  closed_reason: string;
}

export const getSignalList = (
  pagination?: TablePaginationConfig | null,
  searchText?: string,
  filter?: string,
  dateSort?: string,
): Promise<any> => {
  return axiosInstance
    .get<any>(
      `/signal/admin/signal_list?page=${pagination?.current || 1}&size=${pagination?.pageSize || 10}${
        searchText ? `&searchText=${searchText}` : ''
      }${filter ? filter : ''}${dateSort ? `&date_order=${dateSort}` : ''}`,
    )
    .then(data => data)
    .catch(error => {
      throw error;
    });
};

export const getSignalDetail = (id: string): Promise<any> =>
  axiosInstance.get<any>(`signal/admin/signal_detail/${id}`).then(({ data }) => data);

export const createSignal = async (createData: CreateSignalData) => {
  return axiosInstance
    .post('/signal/admin/create_signal', createData)
    .then(data => data)
    .catch(error => {
      throw error;
    });
};

export const updateSignal = async (signalData: UpdateSignal) => {
  return axiosInstance
    .put('/signal/admin/update_signal_v2', signalData)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
};

export const closeSignal = async (closeData: ClosedSignal) => {
  return axiosInstance
    .put('/signal/admin/closed_signal', closeData)
    .then(data => data)
    .catch(error => {
      throw error;
    });
};

export const approveSignal = (id: string): Promise<any> =>
  axiosInstance.post<any>(`/signal/admin/approve/${id}`).then(({ data }) => data);

export const approveManySignal = async (data: ApproveSignal) => {
  console.log(data);

  return axiosInstance
    .post(`/signal/admin/approve_many`, data)
    .then(data => data)
    .catch(error => {
      throw error;
    });
};

export const sendManySignal = async (data: SendManySignal) => {
  console.log(data);

  return axiosInstance
    .post(`/signal/admin/send_many`, data)
    .then(data => data)
    .catch(error => {
      throw error;
    });
};

export const deleteSignal = async (id: string) => {
  return axiosInstance
    .delete(`/signal/admin/delete_signal/${id}`)
    .then(data => data)
    .catch(error => {
      throw error;
    });
};

export const sendSignalNotification = async (notiData: SendSignalNotification): Promise<any> => {
  return axiosInstance
    .post(`/notification/admin/create_signal_notification`, notiData)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
};

export const deleteManySignal = async (list: Array<string>) =>
  axiosInstance
    .post(`/signal/admin/delete_many`, list)
    .then(data => data)
    .catch(err => {
      throw err;
    });
