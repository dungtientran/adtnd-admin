import { axiosInstance } from './request';

export const listContractApi = {
  getListContract(queryFilter: string, searchText: string): Promise<any> {
    return axiosInstance.get(`/admin/contract/list?${queryFilter}&${searchText}`);
  },
  createContract(data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/create`, data);
  },
  updateContract(id: string, data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/update/${id}`, data);
  },
};
