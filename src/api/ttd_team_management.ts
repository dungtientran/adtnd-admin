import { axiosInstance } from './request';

export const listTeamManagementApi = {
  getListManagement(level: '1' | '2'): Promise<any> {
    return axiosInstance.get(`/admin/sale/list/associate?level=${level}`);
  },
  createManagement(data: any): Promise<any> {
    return axiosInstance.post(`/admin/sale/add_subordinate`, data);
  },
  deleteManagement(data: any): Promise<any> {
    return axiosInstance.post(`/admin/sale/remove_subordinate`, data);
  },
};
