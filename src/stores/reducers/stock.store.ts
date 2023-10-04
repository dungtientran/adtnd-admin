import type { StockState } from '@/interface/stock/stock.interface';
import type { Role } from '@/interface/user/login';
import type { Locale, UserState } from '@/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listStock: [],
  totalPage: 0,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockItem(state, action: PayloadAction<any>) {
      state.listStock = action.payload.data?.rows;
      state.totalPage = action.payload.data?.count;
    },
  },
});

export const { setStockItem } = stockSlice.actions;

export default stockSlice.reducer;
