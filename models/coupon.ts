import { SQLModel } from "./default";
import { User } from "./user";

export interface Coupon extends SQLModel {
  name: string;
  code: string;
  description: string;
  discount: string;
  discount_usage?: string;
  valid_from: string;
  valid_to: string;
  coupon_type?: string;
  user?: User;
  coupon_used: any;
}
