import { SQLModel } from "./default";
import { Orders } from "./orders";
import { User } from "./user";

export interface Commission extends SQLModel {
  uid: string;
  order_id: number;
  order_amount: number;
  coupon_discount_amount: number;
  internal_fee: number;
  commission_percentage: number;
  commission: number;
  status: string;
  user: User;
  order: Orders;
}
