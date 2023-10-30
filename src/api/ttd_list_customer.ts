import { axiosInstance } from './request';

export const listCustomerApi = {
  getListCustomer(param: string, searchText: string, queryFilter: string, sort: string): Promise<any> {
    return axiosInstance.get(`/admin/customer/list?${sort}&${param}&${searchText}&${queryFilter}`);
  },
  createCustomer(newUser: any): Promise<any> {
    return axiosInstance.post('/admin/customer/create', newUser);
  },
  getListUser(searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/customer/search?searchText=${searchText}`);
  },
  getListGroup(searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/group/search?searchText=${searchText}`);
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
  getCustomerSupport(param: string, queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/customer/support/ticket?${param}&${queryFilter}&${searchText}`);
  },
  updateCustomerSupport(ticket_id: string, updateData: any): Promise<any> {
    return axiosInstance.put(`/admin/customer/support/ticket/${ticket_id}`, updateData);
  },
  deleteCustomerSupport(ticket_id: string): Promise<any> {
    return axiosInstance.delete(`/admin/customer/support/ticket/${ticket_id}`);
  },
  
};
