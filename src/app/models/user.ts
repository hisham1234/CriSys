import { Role } from "./role.model";


export class User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    token?: string;
}