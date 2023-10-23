import axios from 'axios';

import { axiosInstance } from './request';

export const listSocialApi = {
  getList(): Promise<any> {
    return axiosInstance.get(`/admin/social/links`);
  },
  createSocial(data: any): Promise<any> {
    return axiosInstance.post(`/admin/social/link`, data);
  },
  updateSocial( id: string, data: any ): Promise<any> {
    return axiosInstance.put(`/admin/social/link/${id}`, data);
  },
  deleteSocial(data: any, id: string): Promise<any> {
    return axiosInstance.get(`/admin/social/link/${id}`, data);
  },
};
