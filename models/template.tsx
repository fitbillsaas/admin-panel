import { SQLModel } from "./default";

export interface Template extends SQLModel {
  name: string;
  title: string;
  email_subject: string;
  email_body: string;
}
