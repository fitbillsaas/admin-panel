import { SQLModel } from "./default";

export interface Cat extends SQLModel {
  name: string;
  sort?: number;
  status: string;
  id: number;
}
