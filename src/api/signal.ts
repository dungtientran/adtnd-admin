import { SignalModel } from "@/interface/signal";
import { axiosInstance } from "./request";
import { TablePaginationConfig } from "antd";
import { error } from "console";

interface CreateSignalData {
  signal: SignalModel;
  target: {
    subscription_product_id: string | null;
    customer_id: string | null;
    group_id: string | null;
    is_send_all: boolean;
  };
}

interface SendSignalNotification {
  title: string
  description: string
  signal_id: string ;
  signal_ids?: Array<string>
}

export const getSignalList = (
  pagination?: TablePaginationConfig | null,
  searchText?: string,
  filter?: string
): Promise<any> => {
  return axiosInstance.get<any>(
    `/signal/admin/signal_list?page=${pagination?.current || 1}&size=${pagination?.pageSize || 10}${searchText ? `&searchText=${searchText}` : ''
    }${filter ? filter : ''}`,
  )
    .then((data) => data)
    .catch((error) => {
      throw error
    });
};


export const getSignalDetail = (id: string): Promise<any> =>
  axiosInstance.get<any>(`signal/admin/signal_detail/${id}`).then(({ data }) => data);

export const createSignal = (createData: CreateSignalData): Promise<any> =>
  axiosInstance.post<any>('/signal/admin/create_signal', createData).then(({ data }) => data);

export const updateSignal = (signalData: CreateSignalData): Promise<any> =>
  axiosInstance.put<any>('/signal/admin/update_signal', signalData).then(({ data }) => data);

export const closeSignal = (closeData: SignalModel): Promise<any> =>
  axiosInstance.put<any>('/signal/admin/closed_signal', closeData).then(({ data }) => data);

export const approveSignal = (id: string): Promise<any> =>
  axiosInstance.post<any>(`/signal/admin/approve/${id}`).then(({ data }) => data);

export const deleteSignal = (id: string): Promise<any> =>
  axiosInstance.delete<any>(`/signal/admin/delete_signal/${id}`).then(({ data }) => data);
export const sendSignalNotification = async (notiData: SendSignalNotification): Promise<any> => {
  return axiosInstance.post(
    `/notification/admin/create_signal_notification`, 
    notiData
  ).then(({ data }) => data).catch(error => { throw error; });
}

export const deleteManySignal = (list: Array<string>): Promise<any> =>
  axiosInstance
    .post<any>(`/signal/admin/delete_many`, list)
    .then(({ data }) => data)
    .catch((err) => {
      throw err;
    });
