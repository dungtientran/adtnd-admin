import { axiosInstance } from './request';

export const listUserApi = {
  getListUser(param: string, queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/sale/list?${queryFilter}&${param}&${searchText}`);
  },
  
};