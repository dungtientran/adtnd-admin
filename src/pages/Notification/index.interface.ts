import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  id: string;
  content: string | null;
  created_at: string;
  description: string;
  extend_url: string | null;
  img_url: string | null;
  is_send: boolean;
  notification_category_id: number;
  title: string;
  updated_at: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
