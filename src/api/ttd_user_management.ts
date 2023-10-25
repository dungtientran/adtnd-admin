import { axiosInstance } from './request';

export const listUserApi = {
  getListUser(param: string, queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/sale/list?${queryFilter}&${param}&${searchText}`);
  },
  createSale(data: any): Promise<any> {
    return axiosInstance.get(`/admin/create_admin_user`, data);
  },
  
};