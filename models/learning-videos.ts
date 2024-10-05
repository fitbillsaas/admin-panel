import { SQLModel } from "./default";

export interface LearningVideos extends SQLModel {
  title: string;
  thumbnail: string;
  sort?: number;
  video: string;
  uid: string;
}
