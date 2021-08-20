export class AnomalyModel {
	id: number;
	anomalyType: string;
	createdAt: Date;
	updatedAt: Date;
	title: string;
	comments: string;

	constructor() {
		this.id = undefined;
		this.anomalyType = '';
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.title = '';
		this.comments = '';
	}
}
