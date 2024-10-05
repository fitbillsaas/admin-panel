import { SQLModel } from "./default";

export interface QuestionOption extends SQLModel {
  option: string;
  is_correct: boolean;
}
