import { Office } from "./office.model";
import { Role } from "./role.model";

export class UserModel {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	roles: Role[];
    refreshRate: number;
    office: Office;
    
	constructor() {
		this.id = undefined;
		this.firstName = '';
		this.lastName = '';
		this.password = '';
		this.roles = [];
        this.refreshRate = 0;
	}
}
