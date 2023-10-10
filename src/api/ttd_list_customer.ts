import { axiosInstance } from './request';

export const listCustomerApi = {
  getListCustomer(param: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/customer/list?${searchText}&${param}`);
  },
  createCustomer(newUser: any): Promise<any> {
    return axiosInstance.post('/admin/customer/create', newUser);
  },
  getSaleList(): Promise<any> {
    return axiosInstance.get('/admin/sale/list');
  },
  addSaleCustomer(data: any): Promise<any> {
    return axiosInstance.post('/admin/customer/add_careby', data);
  },
  removeSaleCustomer(customer_id: string): Promise<any> {
    return axiosInstance.post(`/admin/customer/remove_careby/${customer_id}`);
  },
};
