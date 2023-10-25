import { axiosInstance } from './request';

export const listGreetingApi = {
  getListGreeting(): Promise<any> {
    return axiosInstance.get(`/admin/greeting`);
  },
  updateGreeting(data: any): Promise<any> {
    return axiosInstance.put(`/admin/greeting`, data);
  },

};