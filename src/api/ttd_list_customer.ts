import { axiosInstance } from './request';

export const listCustomerApi = {
  getListCustomer(param: string): Promise<any> {
    return axiosInstance.get(`/admin/customer/list?${param}`);
  },
  createCustomer(newUser: any): Promise<any> {
    return axiosInstance.post('/admin/customer/create', newUser);
  },
};
