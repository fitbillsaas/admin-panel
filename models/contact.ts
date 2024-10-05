/* eslint-disable prettier/prettier */
import { SQLModel } from "./default";
export interface Contact extends SQLModel {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    message: string;
}
