import type { Role } from './login';
import type { Device } from '@/interface/layout/index.interface';
import type { MenuChild } from '@/interface/layout/menu.interface';
import { Commission } from '../commission';

export type Locale = 'zh_CN' | 'en_US';

export interface AminRole {
  id: string;
  name: string;
}

export interface SaleLevel {
  level: number;
}

export interface Wallet {
  amount: number;
}


export interface SaleReport {
  sale_id: AdminModel;
  commission_list: Commission[];
  actual_commission: number;
  temp_commission: number;
  pending_commission: number;
  total_fee_services: number;
}

interface AdminModel {
  id: string;
  fullname: string;
  avatar_url: string | null;
  email: string;
  phone_number: string;
  role: AminRole;
  child_sale_managements: {
    child_admin: AdminModel;
    child_admin_id: string;
  }[];
  SaleLevel: SaleLevel;
  Wallet: Wallet;
}
export interface UserState {
  user: AdminModel;

  menuList: MenuChild[];

  logged: boolean;

  role: Role;

  device: Device;

  collapsed: boolean;

  noticeCount: number;

  locale: Locale;

  newUser: boolean;
}
export interface User {
  id: string;
  fullname: string;
  avatar_url: string | null;
  email: string;
  phone_number: string;
}