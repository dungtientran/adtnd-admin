import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  id: string;
  avatar_url: string;
  fullname: string;
  email: string;
  phone_number: string;
  careby: {
    id: string;
    sale_id: string;
    sale: {
      id: string;
      fullname: string;
      email: string;
      phone_number: string;
      created_date: string;
      updated_date: string;
      avatar_url: string;
      active: boolean;
      role_id: 'string';
    };
  } | null;
  subscription: {
    start_date: string;
    end_date: string;
    id: string;
    subscription_plan: string | null;
    subscription_product: {
      name: string;
      id: string;
    };
  };
  remaining_subscription_day: number;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
