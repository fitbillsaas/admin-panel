import { SQLModel } from "./default";

export interface Setting extends SQLModel {
  display_name: string;
  value: string;
}
