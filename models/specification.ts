import { SQLModel } from "./default";

export interface Specification extends SQLModel {
  uid?: string;
  product_id: number;
  specification: string;
  specification_details: string;
  isDeleted?: boolean;
}
