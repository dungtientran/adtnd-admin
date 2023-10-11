import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface InitDataType {
  id: string;
  amount: string | null;
  customer_id: string;
  created_at: string;
  description: string;
  status: string;
  subscription_plan_id: string;
  customer: {
    avatar_url: string | null;
    email: string;
    fullname: string;
    id: string;
    phone_number: string;
  };
  subscription_plan: {
    subscription_product: {
      name: string;
    };
    cost: number;
    description: string;
    frequency: number;
    id: number;
    name: string;
  };
}
export interface DataType {
  id: string;
  amount: number | null;
  customer_id: string;
  created_at: string;
  description: string;
  name: string;
  email: string;
  phone_number: string;
  package: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
