import { axiosInstance } from './request';

export const listUploadApi = {
  getPresignUrLPut(payload: any): Promise<any> {
    return axiosInstance.post(`/util/get_pre_signed_url_put`, payload);
  },
  getPresignUrLGet(payload: any): Promise<any> {
    return axiosInstance.post(`/util/get_pre_signed_url_get`, payload);
  },
  updateLogoStock(logo_url: string, stock_id: string): Promise<any> {
    return axiosInstance.put(`/stock/update_logo/${stock_id}`, {
      logo_url: logo_url,
    });
  },
};
