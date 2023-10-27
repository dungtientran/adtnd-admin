import { axiosInstance } from './request';

export const listServerPackApi = {
  getList(): Promise<any> {
    return axiosInstance.get(`/subscription/admin/subscription_product`);
  },

};
