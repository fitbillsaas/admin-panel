import { SQLModel } from "./default";
import { Questions } from "./questions";
export interface QuestionSet extends SQLModel {
  title: number;
  questions: Questions[];
}
