import { axiosInstance } from './request';

export const listNotificationApi = {
  getListNotification(param: string, queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`notification/admin/get_all?${queryFilter}&${param}&${searchText}`);
  },
  createNotification(data: any): Promise<any> {
    return axiosInstance.post(`/notification/admin/create`, data);
  },
  updateNotification(data: any): Promise<any> {
    return axiosInstance.put(`/notification/admin/update`, data);
  },
  delteleNotification(id: string): Promise<any> {
    return axiosInstance.delete(`/notification/admin/delete/${id}`);
  },
  sendNotification(data: any): Promise<any> {
    return axiosInstance.post(`/notification/admin/send`, data);
  },
};