import type { Dispatch } from '@reduxjs/toolkit';

import { getStockList } from '@/api/stock.api';

import { setStockItem } from '../reducers/stock.store';
import { createAsyncAction } from '../utils';

export const stockAsync = createAsyncAction(() => {
  return async (dispatch: Dispatch) => {
    const dataStockResponse = await getStockList();
    const payload = dataStockResponse?.data;

    if (dataStockResponse?.code === 200) {
      dispatch(setStockItem(payload));

      return true;
    }

    return false;
  };
});
