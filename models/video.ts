import { Cat } from "./cat";
import { SQLModel } from "./default";

export interface Video extends SQLModel {
  title?: string;
  sort?: number;
  video?: string;
  category: Cat;
}
