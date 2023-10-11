import { axiosInstance } from './request';

export const listContractApi = {
  getListContract(): Promise<any> {
    return axiosInstance.get(`/admin/contract/list`);
  },
  createContract(data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/create`, data);
  },
 
};
