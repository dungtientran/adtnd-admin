import { request } from './request';


export const getStockList = (params?: any) => request('get', 'stock/get-list-stock', params);
