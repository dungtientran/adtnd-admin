export interface StockState {
  code?: number;
  data?: {
    count?: number;
    rows?: {
      id?: string;
      name?: string;
      logo_url?: string;
      code?: string;
      market?: string;
      en_name?: string;
    }[];
  };
}
