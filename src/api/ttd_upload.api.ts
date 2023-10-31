import { axiosInstance } from './request';

export const listUploadApi = {
  getUrlS3(payload: any): Promise<any> {
    return axiosInstance.post(`/util/get_pre_signed_url_put`, payload);
  },
  getUrlImage(payload: any): Promise<any> {
    return axiosInstance.post(`/util/get_pre_signed_url_get`, payload);
  },
};
