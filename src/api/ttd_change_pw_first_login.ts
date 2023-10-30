import { axiosInstance } from './request';

export const changeFirstLoginApi = async (data: any) => {
  try {
    const res: any = await axiosInstance.post(`/admin/force_change_password`, data);

    return res;
  } catch (error) {
    return error;
  }
};
