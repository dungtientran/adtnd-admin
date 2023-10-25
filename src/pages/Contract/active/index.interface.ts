import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  commission: string;
  contract_commission: {
    sales_commission: number;
    manager_commission: number;
    director_commission: number;
    fila_commission: number;
  };
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
    profit_percent: number;
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
  };
  profit_percent: number;
}
export interface ColumnTyle {
  contract_no: string;
  customer_code: string;
  name: string;
  phone_number: string;
  email: string;
  staff_code: string;
  name_sale: string;
  start_date: string;
  end_date: string;
  initial_value: string;
  expected_end_value: string;
  commission: string;
  status: string;
  id: number;
  profit_percent: number;
}
export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof ColumnTyle;
