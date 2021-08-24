export class Role {
    id: number;
    roleName: string;

    constructor(roleName, id?){
        this.roleName = roleName;
        this.id = id ? id : null;
    }
}