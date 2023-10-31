import { axiosInstance } from './request';

export const listSocialApi = {
  getList(): Promise<any> {
    return axiosInstance.get(`/admin/social/links`);
  },
  createSocial(data: any): Promise<any> {
    return axiosInstance.post(`/admin/social/link`, data);
  },
  updateSocial(data: { id: string; payload: any }): Promise<any> {
    return axiosInstance.put(`/admin/social/link/${data.id}`, data.payload);
  },
  deleteSocial(id: string): Promise<any> {
    return axiosInstance.delete(`/admin/social/link/${id}`);
  },
};
