import { axiosInstance } from './request';

export const listTransactionApi = {
  getListTransactionHistory(param: string, queryFilter: string): Promise<any> {
    return axiosInstance.get(`/payment/admin/transactions?${queryFilter}&${param}`);
  },
  
};
