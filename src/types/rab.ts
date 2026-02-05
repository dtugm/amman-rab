export interface RabItem {
  id: string;
  numbering: string;
  description: string;
  qty?: number | string;
  hours?: number | string;
  days?: number | string;
  months?: number | string;
  volume?: number | string;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  children?: RabItem[];
}
