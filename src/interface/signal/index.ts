import { IlistStock } from "../stock/stock.interface";

export interface TimeData {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
}

export interface SignalModel {
  id: string;
  code: string;
  stock_id: string;
  description: string;
  target_buy_price: number;
  target_sell_price_1: number;
  target_sell_price_2: number;
  target_sell_price_3: number;
  target_stop_loss: number;
  target_take_profit: number;
  is_closed: boolean;
  is_long_term: boolean;
  priority: boolean;
  closed_reason: string;
  is_approved: boolean;
  closed_price: number;
  closed_date: string;
  action_date: string;
  created_at: string;
  updated_at: string;
  stock: IlistStock;
  time_data: TimeData[];

  target?: Array<{
    id: string;
    subscription_product_id: string | null;
    signal_id: string | null;
    group_id: string | null;
    customer_id: null;
    customer: {
      id: string;
      email: string;
    };
    is_send_all: boolean;
  }>;
}
