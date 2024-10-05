import { SQLModel } from "./default";

export interface Article extends SQLModel {
    thumb: string;
    title: string;
    description: string;
    date: string;
    url: string;
    sort?: number;
}
