export interface ICode {
  code: number;
}
export interface Icount {
  count?: number;
}
export interface IlistStock {
  id?: string;
  name?: string;
  logo_url?: string;
  code?: string;
  market?: string;
  en_name?: string;
}

export interface StockState {
  code?: ICode;
  data?: {
    count?: Icount;
    rows?: IlistStock[];
  };
}
