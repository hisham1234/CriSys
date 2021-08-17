import { AnomalyReportImageModel } from './anomalyReportImage.model';
export class ReportModel {
	id: number;
	road: string;
	title: string;
	comment: string;
	latitude: string;
	longitude: string;
	kp: string;
	anomalyId: number;
	createdAt: Date;
	updatedAt: Date;
	anomalyReportImage: AnomalyReportImageModel[];

	constructor() {
		this.id = undefined;
		this.road = '';
		this.title = '';
		this.comment= '';
		this.createdAt = new Date;
		this.updatedAt = new Date;
		this.latitude = '';
		this.longitude = '';
		this.kp = '';
		this.anomalyId = undefined;
		this.anomalyReportImage = [];
	}
}
