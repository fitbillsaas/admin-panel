import { SQLModel } from "./default";

export interface State extends SQLModel {
  name: string;
  code: string;
}
