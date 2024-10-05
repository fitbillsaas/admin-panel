import { SQLModel } from "./default";

export interface Youtube extends SQLModel {
  title: string;
  url: string;
  thumb: string;
  sort?: number;
}
