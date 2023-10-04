import axios from 'axios';
import { axiosInstance } from './request';

export const getStockList = async (params: string) => {
  try {
    const res = await axios.get(
      `https://yys2edw6d6.execute-api.ap-southeast-1.amazonaws.com/dev/stock/get-list-stock?${params}`,
    );

    return res.data?.data;
  } catch (error) {
    console.log(error);
  }
};


export const searchStock = (text: string | null): Promise<any> =>
  axiosInstance
    .get<any>('/stock/search?searchText=' + text)
    .then(({ data }) => data)
    .catch((error) => console.log(error));
