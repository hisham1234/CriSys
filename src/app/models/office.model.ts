export class Office {
    id: number; 
    officeName: string;
    parentOffice: Office;

    constructor(officeName: string, id?: number, parentOffice?: Office) {
        this.id = id ? id: null;
        this.officeName = officeName;
        this.parentOffice = parentOffice? parentOffice: null;
    }

}