import { axiosInstance } from './request';

export const listInterestRateApi = {
  getListSubscription(): Promise<any> {
    return axiosInstance.get(`/admin/commission/commission_rate?page=1&type=subscription`);
  },
  getListProfit(page: number): Promise<any> {
    return axiosInstance.get(`/admin/commission/commission_rate?page=${page}&type=profit`);
  },
  updateInterest(id: string , data: any): Promise<any> {
    return axiosInstance.put(`/admin/commission/update_commission_rate/${id}`, data);
  },
  createInterstRate(data: any): Promise<any> {
    return axiosInstance.post(`/admin/commission/create_commission_rate`, data);
  },
};
