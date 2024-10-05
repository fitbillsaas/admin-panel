import { SQLModel } from "./default";
import { User } from "./user";

export interface Orders extends SQLModel {
  uid: string;
  user_id: number;
  cart_id: number;
  sub_total: number;
  shipping_price: number;
  tax: number;
  total: number;
  is_repeating_order: string;
  repeating_days: number;
  is_base_order: string;
  parent_order_id: number;
  status: string;
  user: User;
  previous_order: any;
  current_status: any;
}
