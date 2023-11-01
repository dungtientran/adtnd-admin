import { axiosInstance } from './request';

export const listUserApi = {
  getListUser(param: string, queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/sale/list?${queryFilter}&${param}&${searchText}`);
  },
  createSale(data: any): Promise<any> {
    return axiosInstance.post(`/admin/create_admin_user`, data);
  },
  updateSale(data: any): Promise<any> {
    return axiosInstance.put(`/admin/update-sale`, data);
  },
  delteleSale(id: string): Promise<any> {
    return axiosInstance.delete(`/admin/sale/remove_account/${id}`);
  },
  
};