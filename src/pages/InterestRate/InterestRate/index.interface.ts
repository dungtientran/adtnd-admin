import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  commission: string;
  contract_no: string;
  created_at: string;
  customer_id: string;
  end_date: string;
  expected_end_value: number;
  id: number;
  initial_value: number;
  note: string;
  sale_id: string;
  start_date: string;
  status: string;
  updated_at: string;
  customer: {
    active: boolean;
    address: string;
    avatar_url: string;
    birthday: string;
    code_invited: string;
    created_date: string;
    customer_code: string;
    deleted_at: string;
    fullname: string;
    id: string;
    index: number;
    nav: number;
    phone_number: string;
    updated_date: string;
    email: string;
  };
  sale: {
    active: boolean;
    avatar_url: string;
    created_date: string;
    customer_id: string;
    deleted_at: string;
    email: string;
    fullname: string;
    id: string;
    index: number;
    phone_number: string;
    role_id: string;
    staff_code: string;
    updated_date: string;
  }
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
