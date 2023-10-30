import axios from 'axios';

import { axiosInstance } from './request';

export const listContractApi = {
  getListContract(params: string, queryFilter: string, searchText: string, sort: string): Promise<any> {
    return axiosInstance.get(`/admin/contract/list?${params}&${queryFilter}&${searchText}&${sort}`);
  },
  createContract(data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/create`, data);
  },
  updateContract(id: string, data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/update/${id}`, data);
  },
  getUrlIconSocial(formData: any): Promise<any> {
    return axios.post(`https://api.cloudinary.com/v1_1/dbkgkyh4h/image/upload`, formData);
  },
};
