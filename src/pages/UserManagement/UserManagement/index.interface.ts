import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  id: string;
  avatar_url: string | null;
  email: string;
  fullname: string;
  phone_number: string;
  SaleLevel: {
    level: number;
  };
  role: {
    id: string;
    name: string;
  };
  staff_code: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
