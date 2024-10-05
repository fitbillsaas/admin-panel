import { SQLModel } from "./default";
export interface OrderLogs extends SQLModel {
  order_id: number;
  status: string;
}
