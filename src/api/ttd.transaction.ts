import { axiosInstance } from './request';

export const listTransactionApi = {
  getListTransactionHistory(param: string, queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/payment/admin/transactions?${queryFilter}&${param}&${searchText}`);
  },
};
